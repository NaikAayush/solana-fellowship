import { pageTypes } from "../action_types";

export function setActivePage(page) {
  return async dispatch => {
    dispatch({type: pageTypes.SET_SELECTED_PAGE, page});
  };
}
