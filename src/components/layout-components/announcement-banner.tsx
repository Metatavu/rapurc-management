/* eslint-disable no-trailing-spaces */
import { Box, Link, Paper, Typography } from "@mui/material";
import React from "react";

const announcementText = "Palvelun ylläpito tulee päättymään 30.9. Purkukartoitus.fi tulee korvautumaan Syken "
  + "ylläpitämän Rapu-tietojärjestelmän vastaavalla palvelulla. Rapu on rakennettu rakentamislain 16 §:n "
  + "pohjalta edellytettävän purkumateriaali- ja rakennusjäteselvityksen laadintaan ja vuoden loppuun mennessä "
  + "Rapuun tullaan lisäämään vapaaehtoinen purkukartoitus-osio, joka tulee ensi vaiheessa mahdollistamaan "
  + "uudelleenkäytettävien tuotteiden ilmoittamisen.";

/**
 * Service shutdown announcement banner shown across views.
 */
const AnnouncementBanner: React.FC = () => {
  return (
    <Paper
      square
      sx={{
        position: "sticky",
        top: 0,
        zIndex: theme => theme.zIndex.appBar + 2,
        backgroundColor: "#FFF4A8",
        color: "#000",
        borderBottom: "1px solid rgba(0, 0, 0, 0.25)"
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 1.5
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Hyvä purkukartoitus.fi-palvelun käyttäjä!
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.5 }}>
          { announcementText }
        </Typography>

        <Typography variant="body2" sx={{ mt: 2, lineHeight: 1.5 }}>
          Lisätietoa Rapu-tietojärjestelmästä saat järjestelmän asiakastuesta:
          <Link
            href="mailto:rapu-tuki@syke.fi"
            color="inherit"
            underline="always"
            sx={{ fontWeight: 700 }}
          >
            rapu-tuki@syke.fi
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default AnnouncementBanner;