'use strict';

import { RECEIVE_MESSAGE, DISCONNECT, CONNECT } from '../constants/ActionTypes';
import {processStreamData} from '../utils/ProcessStreamData';


const initialState = {
  stocks: {},
  status: false
};

export default function messages(state = initialState, action) {

  switch (action.type) {
    case RECEIVE_MESSAGE:
      return {
        ...state,
        stocks: processStreamData(state.stocks, action.message)
      }

    case CONNECT:
      return {
        stocks: {},
        status: true
      }

    case DISCONNECT:
      return {
        stocks: {},
        status: false
      }

    default:
      return state;
  }

}
