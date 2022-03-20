import { mailTypes } from "../action_types";

const initialState = {
  loading: false,
  isError: false,
  errMsg: null,
  inbox: [],
  sent: []
};

export function mail(state = initialState, action) {
  switch (action.type) {
    case mailTypes.GET_REQUEST:
    case mailTypes.SEND_REQUEST:
      return {
        ...state,
        isError: false,
        errMsg: null,
        loading: true
      };
    case mailTypes.GET_SUCCESS:
    case mailTypes.SEND_SUCCESS:
      return {
        ...state,
        loading: false,
        inbox: action.payload.inbox,
        sent: action.payload.sent
      };
    case mailTypes.GET_FAILURE:
    case mailTypes.SEND_FAILURE:
      return {
        ...state,
        loading: false,
        isError: true,
        errMsg: action.payload.message
      };
    default:
      return state;
  }
}
