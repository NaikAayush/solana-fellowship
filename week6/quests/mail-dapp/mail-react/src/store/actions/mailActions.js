import { fetchData, send } from '../../services';
import { mailTypes } from '../action_types';

export function getAccountData() {
  return async (dispatch, getState) => {
    dispatch(request());

    try {
      const accountId = getState().account.accountId;

      const mailAccount = await fetchData(accountId);

      dispatch(success({
        inbox: mailAccount.inbox,
        sent: mailAccount.sent
      }));
    } catch (error) {
      console.log(error);
      dispatch(failed({message: error.message}));
    }
  };

  function request() { return {type: mailTypes.GET_REQUEST}}
  function success(payload) { return {type: mailTypes.GET_SUCCESS, payload}}
  function failed(payload) { return {type: mailTypes.GET_FAILURE, payload}}
}


export function sendMail(mail) {
  return async (dispatch, getState) => {
    dispatch(request());

    try {
      const programId = getState().account.programId;
      const wallet = getState().account.wallet;

      await send(mail, programId, wallet);

      const accountId = getState().account.accountId;
      const mailAccount = await fetchData(accountId);

      dispatch(success({
        inbox: mailAccount.inbox,
        sent: mailAccount.sent
      }));
    } catch (error) {
      console.log(error);
      dispatch(failed({message: error.message}));
    }
  };

  function request() { return {type: mailTypes.SEND_REQUEST}}
  function success(payload) { return {type: mailTypes.SEND_SUCCESS, payload}}
  function failed(payload) { return {type: mailTypes.SEND_FAILURE, payload}}
}
