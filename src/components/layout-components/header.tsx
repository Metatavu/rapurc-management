import { ArrowBackIosNewSharp } from "@mui/icons-material";
import { Hidden, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import strings from "localization/strings";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppTitle, Root } from "styled/layout-components/header";
import ProfileMenu from "./profile-menu";
import Navigation from "./top-navigation";

/**
 * Component properties
 */
interface Props {
  title: string;
  back?: boolean;
  customControls?: JSX.Element;
}

/**
 * Header component
 *
 * @param props component properties
 */
const Header: React.FC<Props> = ({
  title,
  children,
  back,
  customControls
}) => {
  const navigate = useNavigate();

  return (
    <Root position="relative">
      <Toolbar>
        <AppTitle>
          { strings.appTitle }
        </AppTitle>
        <Stack direction="row" spacing={ 2 }>
          <Hidden smDown>
            <Navigation/>
          </Hidden>
          <ProfileMenu/>
        </Stack>
      </Toolbar>
      <Toolbar>
        <Stack
          width="100%"
          direction="row"
          spacing={ 2 }
          sx={{
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Stack
            direction="row"
            spacing={ 2 }
          >
            { back &&
              <IconButton onClick={ () => navigate("/surveys") }>
                <ArrowBackIosNewSharp htmlColor="#ffffff"/>
              </IconButton>
            }
            <Typography variant="h1">
              { title }
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={ 2 }
          >
            { customControls }
          </Stack>
        </Stack>
      </Toolbar>
      { children }
    </Root>
  );
};

export default Header;