import React from 'react';
import { Field, Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const ObjectWidget = ({
  schema,
  value,
  onChange,
  errors = {},
  id,
  ...props
}) => {
  const renderFieldSet = React.useCallback(
    (fieldset) => {
      return fieldset.fields.map((field, index) => {
        return (
          <Field
            {...schema.properties[field]}
            id={field}
            fieldset={fieldset.title.toLowerCase()}
            focus={index === 0}
            value={value?.[field]}
            required={schema.required.indexOf(field) !== -1}
            onChange={(field, fieldvalue) => {
              return onChange(id, { ...value, [field]: fieldvalue });
            }}
            key={field}
            error={errors[field]}
          />
        );
      });
    },
    [errors, onChange, schema, value, id],
  );

  return schema.fieldsets.length === 1 ? (
    renderFieldSet(schema.fieldsets[0])
  ) : (
    <Tab
      panes={schema.fieldsets.map((fieldset) => {
        return {
          menuItem: fieldset.title,
          render: () => <Tab.Pane>{renderFieldSet(fieldset)}</Tab.Pane>,
        };
      })}
    />
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ObjectWidget.propTypes = {
  id: PropTypes.any.isRequired,
  schema: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
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
