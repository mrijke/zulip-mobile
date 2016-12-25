import {
  MESSAGE_FETCH_START,
  MESSAGE_FETCH_SUCCESS,
  EVENT_NEW_MESSAGE,
  EVENT_UPDATE_MESSAGE,
} from '../constants';
import { isMessageInNarrow } from '../utils/narrow';

const initialState = {
  fetching: false,
  caughtUp: false,
  narrow: [],
  messages: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MESSAGE_FETCH_START:
      return {
        ...state,
        fetching: true,
        narrow: action.narrow
      };

    case MESSAGE_FETCH_SUCCESS: {
      const key = JSON.stringify(action.narrow);
      const messages = state.messages[key] || [];
      const newMessages = action.messages
        .filter(x => !messages.find(msg => msg.id === x.id))
        .concat(messages)
        .sort((a, b) => a.timestamp - b.timestamp);

      return {
        fetching: false,
        narrow: action.narrow,
        caughtUp: action.caughtUp,
        messages: {
          ...state.messages,
          [key]: newMessages,
        }
      };
    }

    case EVENT_NEW_MESSAGE: {
      return {
        fetching: state.fetching,
        narrow: state.narrow,
        caughtUp: state.caughtUp,
        messages: Object.keys(state.messages).reduce((msg, key) => {
          msg[key] = isMessageInNarrow(action.message, JSON.parse(key)) ? // eslint-disable-line
          [
            ...state.messages[key],
            action.message,
          ] :
          state.messages[key];

          return msg;
        }, {}),
      };
    }

    case EVENT_UPDATE_MESSAGE: {
      return {
        fetching: state.fetching,
        narrow: state.narrow,
        caughtUp: state.caughtUp,
        messages: Object.keys(state.messages).reduce((msg, key) => {
          const messages = state.messages[key];
          const prevMessageIndex = messages.findIndex(x => x.id === action.messageId);
          msg[key] = prevMessageIndex !== -1 ? // eslint-disable-line
          [
            ...messages.slice(0, prevMessageIndex),
            {
              ...messages[prevMessageIndex],
              content: action.newContent,
              edit_timestamp: action.editTimestamp,
            },
            ...messages.slice(prevMessageIndex + 1),
          ] :
          state.messages[key];

          return msg;
        }, {}),
      };
    }

    default:
      return state;
  }
};