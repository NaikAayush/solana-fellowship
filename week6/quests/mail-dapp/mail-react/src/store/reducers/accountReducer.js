import { Keypair } from "@solana/web3.js";
import { accountTypes } from "../action_types";

const programSecretKeyString = "[244,183,246,223,207,188,48,191,111,108,21,30,43,156,24,16,124,88,68,237,224,88,141,207,249,9,33,132,57,139,248,84,15,205,52,143,214,55,66,143,227,152,73,250,41,48,91,208,166,94,81,137,2,126,88,188,41,203,126,18,139,74,5,167]"
const programSecretKey = Uint8Array.from(JSON.parse(programSecretKeyString));
const programKeypair = Keypair.fromSecretKey(programSecretKey);

const initialState = {
  loading: false,
  isError: false,
  errMsg: null,
  wallet: null,
  accountId: '',
  programId: programKeypair.publicKey
};

export function account(state = initialState, action) {
  switch (action.type) {
    case accountTypes.CREATE_REQUEST:
      return {
        ...state,
        isError: false,
        errMsg: null,
        loading: true
      };
    case accountTypes.CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        wallet: action.payload.wallet,
        accountId: action.payload.derivedAddress,
      };
    case accountTypes.CREATE_FAILURE:
      return {
        ...state,
        loading: false,
        isError: true,
        errMsg: action.payload.error
      };
    default:
      return state;
  }
}
