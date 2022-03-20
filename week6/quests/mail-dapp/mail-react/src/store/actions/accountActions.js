import { accountTypes } from "../action_types";
import { createOrGetAccount } from "../../services";

export function connectWallet(seed) {
  return async (dispatch, getState) => {
    dispatch(request());

    try {
      const programId = getState().account.programId;
      const { derivedAddress, wallet } = await createOrGetAccount(seed, programId);

      dispatch(success({ derivedAddress, wallet }));
    } catch (error) {
      dispatch(failed({error}));
    }
  };

  function request() { return {type: accountTypes.CREATE_REQUEST}}
  function success(payload) { return {type: accountTypes.CREATE_SUCCESS, payload}}
  function failed(payload) { return {type: accountTypes.CREATE_FAILURE, payload}}
}
