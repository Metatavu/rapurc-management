import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import { UserGroup } from "generated/client";

/**
 * Interface describing group state in Redux
 */
export interface GroupState {
  userGroups: UserGroup[];
}

/**
 * Initial locale state
 */
const initialState: GroupState = {
  userGroups: []
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
    }
  }
});

/**
 * Group actions from created group slice
 */
export const { setUserGroups } = groupSlice.actions;

/**
 * Select group state selector
 *
 * @param state Redux store root state
 * @returns group state from Redux store
 */
export const selectGroupState = (state: RootState) => state.groups.userGroups;

/**
 * Select group selector
 *
 * @param state Redux store root state
 * @returns usergroup from Redux store
 */
export const selectGroup = (state: RootState) => state.groups.userGroups;

/**
 * Reducer for group slice
 */
export default groupSlice.reducer;