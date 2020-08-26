import React from 'react';
import { Tab } from 'semantic-ui-react';
import Field from '../Form/Field';
import PropTypes from 'prop-types';

const ObjectWidget = ({
  schema,
  value, // not checked to not contain unknown fields
  onChange,
  errors = {},
  id,
  ...props
}) => {
  const renderFieldSet = React.useCallback(
    (fieldset, fieldsetIndex) => {
      return fieldset.fields.map((field, index) => {
        const myIndex = index;
        console.log('TODO', field, myIndex);
        return (
          <Field
            {...schema.properties[field]}
            id={`${field}-${fieldsetIndex}-${myIndex}`} // if we add here -${id} the form does not work
            fieldset={fieldset.title.toLowerCase()}
            value={value?.[field]}
            required={schema.required.indexOf(field) !== -1}
            onChange={(field, fieldvalue) => {
              return onChange(id, { ...value, [field]: fieldvalue });
            }}
            key={field}
            error={errors?.[field]}
            title={schema.properties[field].title}
          />
        );
      });
    },
    [errors, id, onChange, schema.properties, schema.required, value],
  );

  const createTabPane = React.useCallback(
    (fs, index) => {
      console.log('outer fieldset #', index);
      return (() => {
        const idx = index;
        return () => {
          console.log('inner fieldset #', idx);
          return <Tab.Pane>{renderFieldSet(fs, idx)}</Tab.Pane>;
        };
      })();
    },
    [renderFieldSet],
  );

  const createTab = React.useCallback(
    (fieldset, index) => {
      return {
        menuItem: fieldset.title,
        render: createTabPane(fieldset, index),
      };
    },
    [createTabPane],
  );

  return schema.fieldsets.length === 1 ? (
    renderFieldSet(schema.fieldsets[0], 0)
  ) : (
    <Tab panes={schema.fieldsets.map(createTab)} /> // lazy loading
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ObjectWidget.propTypes = {
  id: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  errors: PropTypes.object,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
ObjectWidget.defaultProps = {};

export default ObjectWidget;
