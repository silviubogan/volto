import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import Edit from './Edit';

const mockStore = configureStore();

// Source: https://medium.com/pixel-and-ink/testing-loadable-components-with-jest-97bfeaa6da0b
// Loadable components is tied to webpack, seems most people use webpack in
// their tests. Rather than that, we mock the loadable function to load the
// module eagarly and expose a load() function to be able to await the load
function loadable(load) {
  let Component;
  // Capture the component from the module load function
  const loadPromise = load().then((val) => {
    // console.log('val', val);
    return (Component = val.default);
  });
  // Create a react component which renders the loaded component
  const Loadable = (props) => {
    if (!Component) {
      throw new Error(
        'Bundle split module not loaded yet, ensure you' +
          ' beforeAll(() => MyLazyComponent.load()) in ' +
          'your test, import statement: ' +
          load.toString(),
      );
    }
    return <Component {...props} />;
  };
  Loadable.load = () => loadPromise;
  Loadable.load();
  return Loadable;
}

jest.mock('@plone/volto/helpers', function () {
  const originalModule = jest.requireActual('@plone/volto/helpers');

  return {
    __esModule: true,
    ...originalModule,
    withLoadable: jest.fn().mockImplementation(function (libStr) {
      // TODO: make this import work (this is the cause of the error:
      // `Property value expected type of string but got null`)
      return loadable(() => import(libStr));
    }),
  };
});

// Or this simple statement, but it does not work although in __mocks__ the
// directory structure is good and the code is taken from
// @plone/volto/helpers/Loadable/Loadable.jsx (to make the tests that normally
// works - all except one - please rename __mocks__ into something like
// `old__mocks__`):
//
// jest.mock('@plone/volto/helpers');
//
// (also see:
// - https://stackoverflow.com/questions/64914076/how-to-mock-loadable-lib-to-make-the-library-be-loaded-synchronously-in-some-uni
// - https://jestjs.io/docs/en/webpack#using-with-webpack-2
// - https://jestjs.io/docs/en/jest-community
// - https://jestjs.io/docs/en/es6-class-mocks#mocking-non-default-class-exports
// - https://github.com/gregberge/loadable-components/issues
// )

test('renders an edit html block component', () => {
  const store = mockStore({
    content: {
      create: {},
      data: {},
    },
    intl: {
      locale: 'en',
      messages: {},
    },
  });
  const component = renderer.create(
    <Provider store={store}>
      <Edit
        data={{ html: '<h1></h1>' }}
        selected={false}
        block="1234"
        onChangeBlock={() => {}}
        onSelectBlock={() => {}}
        onDeleteBlock={() => {}}
        onFocusPreviousBlock={() => {}}
        onFocusNextBlock={() => {}}
        handleKeyDown={() => {}}
        index={1}
      />
    </Provider>,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
