import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ObjectListWidget from './ObjectListWidget';

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

test('renders an object list widget component', () => {
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

test('renders an object list widget component and changes its value by clicking a button', async () => {
  const store = mockStore({
    search: {},
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  let valueState = [
    { external_link: 'https://ddg.gg' },
    { external_link: 'https://wikipedia.org' },
  ];

  const { getByText, asFragment, rerender, findByTestId } = render(
    <Provider store={store}>
      <>
        <ObjectListWidget
          id={`my-widget`}
          schema={LinkSchema}
          title="My Widget"
          onChange={(id, v) => {
            valueState = v;
            rerender();
          }}
          error={{}}
          value={valueState}
          required={true}
          fieldSet={{}}
          description="My description"
          onDelete={() => {}}
          onEdit={() => {}}
        />
        <button
          onClick={(e) => {
            valueState = [{ external_link: 'https://duckduckgo.com' }];
            rerender();
            e.preventDefault();
          }}
        >
          Click me !
        </button>
      </>
    </Provider>,
  );

  expect(asFragment()).toMatchSnapshot();

  fireEvent.click(getByText('Click me !'));

  fireEvent.click(await findByTestId('big-pen-button'));

  fireEvent.click(getByText('External'));

  expect(asFragment()).toMatchSnapshot();
});
