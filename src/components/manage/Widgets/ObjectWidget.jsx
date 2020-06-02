import React from 'react';
import { Tab } from 'semantic-ui-react';
import Field from '../Form/Field';
import PropTypes from 'prop-types';

const ObjectWidget = ({
  schema,
  value,
  onChange,
  errors = {},
  id,
  ...props
}) => {
  const renderFieldSet = (fieldset) => {
    return fieldset.fields.map((field) => {
      return (
        <Field
          {...schema.properties[field]}
          id={field}
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
  };

  const createTabPane = (fs) => () => {
    console.log('fieldset', fs); // always prints the first fieldset
    return <Tab.Pane>{renderFieldSet(fs)}</Tab.Pane>;
  };

  const createTab = (fieldset) => {
    return {
      menuItem: fieldset.title,
      render: createTabPane(fieldset),
    };
  };

  const panes = schema.fieldsets.map(createTab);
  console.log('panes', panes);
  console.log('FIELDSETS', schema.fieldsets); // all of them are there
  console.log('count', schema.fieldsets.length);
  return schema.fieldsets.length === 1 ? (
    renderFieldSet(schema.fieldsets[0])
  ) : (
    <Tab panes={panes} />
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
