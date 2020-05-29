import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import ObjectListWidget from './ObjectListWidget';

const mockStore = configureStore();

test('renders an object list widget component', () => {
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
  const store = mockStore({
    search: {},
    intl: {
      locale: 'en',
      messages: {},
    },
  });
  const component = renderer.create(
    <Provider store={store}>
      <ObjectListWidget
        id="my-widget"
        schema={LinkSchema}
        title="My Widget"
        onChange={() => {}}
        error={{}}
        value={[
          { external_link: 'https://dgg.gg' },
          { external_link: 'https://wikipedia.org' },
        ]}
        required={true}
        fieldSet={{}}
        description="My description"
        onDelete={() => {}}
        onEdit={() => {}}
      />
    </Provider>,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
