import { RECEIVE_MESSAGE, CONNECT, DISCONNECT } from '../constants/ActionTypes';

export function connect() {
  return {
    type: CONNECT
  }
}

export function disconnect() {
  return {
    type: DISCONNECT
  }
}

export function receiveMessage(message){
  return {
    type: RECEIVE_MESSAGE,
    message
  }
}
