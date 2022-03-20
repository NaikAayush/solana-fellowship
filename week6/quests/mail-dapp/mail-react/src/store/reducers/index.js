import { combineReducers } from 'redux';

import { page } from './pageReducer';
import { account } from './accountReducer';
import { mail } from './mailReducer';

const rootReducer = combineReducers({
  page,
  account,
  mail
});

export default rootReducer;
