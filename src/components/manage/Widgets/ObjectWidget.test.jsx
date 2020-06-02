import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import ObjectWidget from './ObjectWidget';

const mockStore = configureStore();

const LinkSchema = {
  title: 'Link',
  fieldsets: [
    {
      id: 'internal',
      title: 'Internal',
      fields: ['internal_link'],
    },
    {
      id: 'external',
      title: 'External',
      fields: ['external_link'],
    },
    {
      id: 'email',
      title: 'Email',
      fields: ['email_address', 'email_subject'],
    },
  ],
  properties: {
    internal_link: {
      widget: 'object_browser',
      title: 'Internal link',
    },
    external_link: {
      title:
        'External URL (can be relative within this site or absolute if it starts with http:// or https://)',
    },
    email_address: {
      title: 'Email address',
    },
    email_subject: {
      title: 'Email subject (optional)',
    },
  },
  required: [],
};

test('renders an object widget component', () => {
  const store = mockStore({
    search: {},
    intl: {
      locale: 'en',
      messages: {},
    },
  });
  const component = renderer.create(
    <Provider store={store}>
      <ObjectWidget
        id="my-widget"
        schema={LinkSchema}
        value={{}}
        title="My Widget"
        onChange={() => {}}
        errors={{}}
      />
    </Provider>,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});

test('renders an object widget controlled component', () => {
  const store = mockStore({
    search: {},
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  const id = 'my-widget';
  let myVal = { external_link: 'etc' };
  let testRenderer = null;

  let handleChange = (id, val) => {
    myVal = val;
    testRenderer.update(testRenderer.getInstance());
  };

  testRenderer = renderer.create(
    <Provider store={store}>
      <ObjectWidget
        id={id}
        schema={LinkSchema}
        value={myVal}
        title="My Widget"
        onChange={handleChange}
        errors={{}}
      />
    </Provider>,
  );

  const testInstance = testRenderer.root;

  // call onChange then check value

  testInstance
    .findByType(ObjectWidget)
    .props.onChange(id, { external_link: 'abc' });

  expect(testInstance.findByType(ObjectWidget).props.value.external_link).toBe(
    'abc',
  );
});
