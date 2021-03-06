import deepFreeze from 'deep-freeze';

import { RESET_NAVIGATION, LOGIN_SUCCESS } from '../../actionConstants';
import navReducers from '../navReducers';

describe('navReducers', () => {
  describe('RESET_NAVIGATION', () => {
    test('replaces current route stack with a new one', () => {
      const prevState = deepFreeze({
        index: 0,
        routes: [],
      });

      const action = deepFreeze({
        type: RESET_NAVIGATION,
        routes: [{ routeName: 'main', type: undefined }],
      });

      const expectedState = {
        index: 0,
        routes: [{ routeName: 'realm', type: undefined }],
      };

      const newState = navReducers(prevState, action);

      expect(newState.index).toEqual(expectedState.index);
      expect(newState.routes[0].routeName).toEqual(expectedState.routes[0].routeName);
    });

    test('can init with multiple routes at once, last one becomes active', () => {
      const prevState = deepFreeze({
        index: 0,
        routes: [],
      });

      const action = deepFreeze({
        type: RESET_NAVIGATION,
        routes: [{ routeName: 'main', type: undefined }, { routeName: 'first', type: undefined }],
      });

      const expectedState = {
        index: 0,
        routes: [{ routeName: 'realm', type: undefined }],
      };

      const newState = navReducers(prevState, action);

      expect(newState.index).toEqual(expectedState.index);
      expect(newState.routes[0].routeName).toEqual(expectedState.routes[0].routeName);
    });
  });

  describe('LOGIN_SUCCESS', () => {
    test('replaces the existing route stack with "main" on sign in', () => {
      const prevState = deepFreeze({
        index: 2,
        routes: [{ key: 'one' }, { key: 'two' }, { key: 'password' }],
      });

      const action = deepFreeze({
        type: LOGIN_SUCCESS,
      });

      const expectedState = {
        index: 0,
        routes: [{ routeName: 'main' }],
      };

      const newState = navReducers(prevState, action);

      expect(newState.index).toEqual(expectedState.index);
      expect(newState.routes[0].routeName).toEqual(expectedState.routes[0].routeName);
    });
  });
});
