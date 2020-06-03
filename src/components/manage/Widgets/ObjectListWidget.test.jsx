import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ObjectListWidget, {
  FlatObjectList,
  ModalObjectListForm,
  useScrollToBottomAutomatically,
} from './ObjectListWidget';
// import { Modal } from 'semantic-ui-react';

const mockStore = configureStore();
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// TODO: what about localized schemas?
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
        fieldSet="my-field-set"
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

  let jsx = (
    <Provider store={store}>
      <>
        <ObjectListWidget
          id={`my-widget`}
          schema={LinkSchema}
          title="My Widget"
          onChange={(id, v) => {
            valueState = v;
            rerender(jsx);
          }}
          error={{}}
          value={valueState}
          required={true}
          description="My description"
          onDelete={() => {}}
          onEdit={() => {}}
        />
        <button
          onClick={(e) => {
            valueState = [{ external_link: 'https://duckduckgo.com' }];
            rerender(jsx);
            e.preventDefault();
          }}
        >
          Click me !
        </button>
      </>
    </Provider>
  );

  const { getByText, asFragment, rerender, getByTestId, getAllByText } = render(
    jsx,
  );

  expect(asFragment()).toMatchSnapshot();

  // click the button which changes data outside of modal
  fireEvent.click(getByText('Click me !'));

  // open the modal
  fireEvent.click(getByTestId('big-pen-button'));

  // click on the first External tab
  fireEvent.click(getAllByText('External')[0]);

  expect(asFragment()).toMatchSnapshot();
});

test('renders a flat object list component with an item', async () => {
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

  let jsx = (
    <Provider store={store}>
      <FlatObjectList id={`my-widget`} schema={LinkSchema} value={valueState} />
    </Provider>
  );

  const { asFragment, getAllByText } = render(jsx);

  // verify the first tab
  expect(asFragment()).toMatchSnapshot();

  // load second tab in first item
  fireEvent.click(getAllByText('External')[0]);

  // verify the second tab in the first item
  expect(asFragment()).toMatchSnapshot();

  // load second tab in second item
  fireEvent.click(getAllByText('External')[1]);

  // verify the second tab in the second item
  expect(asFragment()).toMatchSnapshot();
});

test('renders a modal object list form component and changes its value from outside, the changes are reflected in the modal', async () => {
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

  let openState = true; // or false?

  let jsx = (
    <Provider store={store}>
      <ModalObjectListForm
        id="my-widget"
        schema={LinkSchema}
        title="Modal title"
        value={valueState}
        open={openState}
        onSave={(id, val) => {
          openState = false;
          rerender(jsx);
        }}
        onCancel={() => {
          openState = false;
          rerender(jsx);
        }}
      />
    </Provider>
  );

  const { asFragment, getByText, rerender, getByTestId } = render(jsx);

  // set value prop to something else than the value before from outside the modal
  valueState = [{ external_link: 'https://duckduckgo.com' }];
  rerender(jsx);

  // in the modal there should be just a single item with the link: https://duckduckgo.com
  expect(asFragment()).toMatchSnapshot();

  const modalContent = getByTestId('modal-content');
  // modalContent.scrollIntoView = jest.fn('a-key', true);

  // add 20 objects to the modal
  for (let i = 0; i < 20; ++i) {
    fireEvent.click(getByText('Add Link'));
  }

  expect(modalContent.scrollIntoView).toHaveBeenCalled();

  // TODO: test props (just render, separate tests): open, title, className,
  // onSave, onCancel, schema, value, id
});

// it('useScrollToBottomAutomatically should scroll', () => {
//   const { getByTestId } = render(
//     <Modal open={true}>
//       <Modal.Content scrolling>
//         <div data-testid="modal-content">
//           <p>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
//             nostrum officia ad qui distinctio amet rem nemo laudantium possimus
//             nobis fugiat dolorem nihil, repellendus laboriosam ipsa velit
//             debitis sapiente. Neque.
//           </p>
//           <p>
//             Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti
//             sapiente nulla reprehenderit eos eaque quos ipsam voluptatem animi
//             molestiae, pariatur quod quam quis! Sequi, nulla possimus suscipit
//             rerum totam quos!
//           </p>
//           <p>
//             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
//             minima hic doloribus repellendus aliquam non nesciunt sapiente
//             eveniet unde! Tempora, aspernatur nobis! Aperiam vero, perspiciatis
//             consectetur debitis eaque similique alias.
//           </p>
//           <p>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
//             nostrum officia ad qui distinctio amet rem nemo laudantium possimus
//             nobis fugiat dolorem nihil, repellendus laboriosam ipsa velit
//             debitis sapiente. Neque.
//           </p>
//           <p>
//             Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti
//             sapiente nulla reprehenderit eos eaque quos ipsam voluptatem animi
//             molestiae, pariatur quod quam quis! Sequi, nulla possimus suscipit
//             rerum totam quos!
//           </p>
//           <p>
//             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
//             minima hic doloribus repellendus aliquam non nesciunt sapiente
//             eveniet unde! Tempora, aspernatur nobis! Aperiam vero, perspiciatis
//             consectetur debitis eaque similique alias.
//           </p>
//           <p>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
//             nostrum officia ad qui distinctio amet rem nemo laudantium possimus
//             nobis fugiat dolorem nihil, repellendus laboriosam ipsa velit
//             debitis sapiente. Neque.
//           </p>
//           <p>
//             Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti
//             sapiente nulla reprehenderit eos eaque quos ipsam voluptatem animi
//             molestiae, pariatur quod quam quis! Sequi, nulla possimus suscipit
//             rerum totam quos!
//           </p>
//           <p>
//             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
//             minima hic doloribus repellendus aliquam non nesciunt sapiente
//             eveniet unde! Tempora, aspernatur nobis! Aperiam vero, perspiciatis
//             consectetur debitis eaque similique alias.
//           </p>
//         </div>
//       </Modal.Content>
//     </Modal>,
//   );
//   // check if the modal has scrolled to bottom automatically
//   let mc = getByTestId('modal-content');
//   let sh = mc.scrollHeight;
//   let st = mc.scrollTop;

//   expect(sh === st, 'The modal has not scrolled to bottom automatically.');

//   const ref = {
//     current: {
//       scrollTo: jest.fn(),
//     },
//   };
//   const chat = ['message1', 'message2'];

//   renderHook(() => useScrollToBottomAutomatically(ref, chat));

//   expect(ref.current.scrollTo).toHaveBeenCalledTimes(1);
// });

// run the tests!
