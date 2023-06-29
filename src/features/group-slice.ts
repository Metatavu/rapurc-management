import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import { UserGroup } from "generated/client";

/**
 * Interface describing group state in Redux
 */
export interface GroupState {
  userGroups: UserGroup[];
  selectedGroup?: UserGroup;
}

/**
 * Initial locale state
 */
const initialState: GroupState = {
  userGroups: [],
  selectedGroup: undefined
};

/**
 * Group slice of Redux store
 */
export const groupSlice = createSlice({
  name: "groups",
  // eslint-disable-next-line object-shorthand
  initialState,
  reducers: {
    setUserGroups: (state, { payload }: PayloadAction<UserGroup[]>) => {
      state.userGroups = payload;
    },
    setSelectedGroup: (state, { payload }: PayloadAction<UserGroup>) => {
      state.selectedGroup = payload;
    }
  }
});

/**
 * Group actions from created group slice
 */
export const { setUserGroups, setSelectedGroup } = groupSlice.actions;

/**
 * Select selected group selector
 *
 * @param state Redux store root state
 * @returns selected group state from Redux store
 */
export const selectSelectedGroup = (state: RootState) => state.groups.selectedGroup;

/**
 * Select group selector
 *
 * @param state Redux store root state
 * @returns usergroup from Redux store
 */
export const selectGroups = (state: RootState) => state.groups.userGroups;

/**
 * Reducer for group slice
 */
export default groupSlice.reducer;