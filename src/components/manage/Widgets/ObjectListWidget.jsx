import { map } from 'lodash';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  Modal,
  Segment,
} from 'semantic-ui-react';
import React, { Fragment, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon as VoltoIcon } from '@plone/volto/components';
import deleteSVG from '@plone/volto/icons/delete.svg';
import penSVG from '@plone/volto/icons/pen.svg';
import addSVG from '@plone/volto/icons/add.svg';

import ObjectWidget from './ObjectWidget';

export const FlatObjectList = ({ id, value = [], schema, onChange }) => {
  // fi - changed field's index
  // fv - changed field's value
  const doChange = useCallback(
    (index, fi, fv) =>
      onChange(
        id, // the id of the FlatObjectList
        // v - the current value
        // i - the current index
        //
        // for each value, if not changed, leave it as it is,
        // otherwise add to it (it being an object)
        // the fi property with the value fv
        value.map((v, i) => (i !== index ? v : { ...v, [fi]: fv })),
      ),
    [id, onChange, value],
  );

  const doDelete = useCallback(
    (index) =>
      onChange(
        id,
        value.filter((v, i) => i !== index),
      ),
    [id, onChange, value],
  );

  return (
    <div className="objectlist-widget-content">
      {!value && <ObjectWidget schema={schema} />}
      {value.map((obj, index) => (
        // TODO: notice that the Fragment key={} might cause problems, need to test
        <Fragment key={index}>
          <Grid>
            <Grid.Column width={11}>
              <Segment>
                <ObjectWidget
                  id={index}
                  key={index}
                  schema={schema}
                  value={obj}
                  onChange={(id, changedObj) => {
                    console.log('FlatObjectList changed');
                    doChange(index, index, changedObj);
                  }}
                  errors={{}}
                />
              </Segment>
            </Grid.Column>
            <Grid.Column width={1}>
              <Button.Group>
                <Button
                  basic
                  circular
                  size="mini"
                  onClick={() => doDelete(index)}
                >
                  {/* TODO: instead of px use rem if possible */}
                  <VoltoIcon size="20px" name={deleteSVG} />
                </Button>
              </Button.Group>
            </Grid.Column>
          </Grid>
        </Fragment>
      ))}
    </div>
  );
};

// TODO: on Add button press, scroll contents to bottom
// TODO: cancel button works or saves?
// TODO: delete item button works or deletes even if not saved?
// TODO: make the ObjectWidget and ObjectListWidget (at least keyboard) accessible
// and use translations where needed

export const ModalObjectListForm = (props) => {
  const {
    open,
    title,
    className,
    onSave,
    onCancel,
    schema,
    value = [],
    id,
  } = props;

  function createEmpty() {
    return {};
  }

  const [stateValue, setStateValue] = useState([...value]);

  useEffect(() => {
    setStateValue([...value]);
  }, [value]);

  const doSave = useCallback(() => {
    onSave(id, stateValue);
  }, [onSave, id, stateValue, value]);

  const doCancel = useCallback(() => {
    onCancel();
  }, [onCancel, value]);

  return (
    <Modal open={open} className={className}>
      <Header>{title}</Header>
      <Modal.Content scrolling>
        <FlatObjectList
          value={stateValue}
          schema={schema}
          onChange={(id, v) => {
            setStateValue([...v]);
          }}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          basic
          circular
          floated="left"
          size="big"
          className="icon"
          onClick={() => {
            setStateValue([...stateValue, createEmpty()]);
          }}
        >
          {/* TODO: instead of px use rem if possible */}
          <VoltoIcon size="18px" name={addSVG} />
          Add {schema.title}
        </Button>

        <Button
          basic
          circular
          primary
          floated="right"
          icon="arrow right"
          aria-label="Save"
          title="Save"
          size="big"
          onClick={doSave}
        />
        <Button
          basic
          circular
          secondary
          icon="remove"
          aria-label="Cancel"
          title="Cancel"
          floated="right"
          size="big"
          onClick={doCancel}
        />
      </Modal.Actions>
    </Modal>
  );
};

const ObjectListWidget = (props) => {
  const {
    id,
    value = [],
    schema,
    onChange,
    required,
    error,
    fieldSet,
    title,
    description,
    onDelete,
    onEdit,
  } = props;

  const [open, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState([...value]);

  useEffect(() => {
    setOpen(false);
    onChange(id, currentValue);
  }, [currentValue]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  });

  const handleSave = useCallback((id, val) => {
    setCurrentValue([...val]);
  }, [currentValue]);

  console.log('render of ObjectListWidget, ', currentValue);

  return (
    <>
      <ModalObjectListForm
        id={id}
        schema={schema}
        open={open}
        onSave={handleSave}
        onCancel={handleCancel}
        value={currentValue}
      />
      <Form.Field
        onClick={(e) => {
          e.preventDefault();
        }}
        inline
        required={required}
        error={(error || []).length > 0}
        className={description ? 'help text' : 'text'}
        id={`${fieldSet || 'field'}-${id}`}
      >
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width="4">
              <div className="wrapper">
                <label htmlFor={`field-${id}`}>
                  {onEdit && (
                    <i
                      aria-hidden="true"
                      className="grey bars icon drag handle"
                    />
                  )}
                  {title}
                </label>
              </div>
            </Grid.Column>
            <Grid.Column width="8">
              <Input
                id={`field-${id}`}
                name={id}
                disabled={true}
                icon={penSVG}
                value={`A collection of ${currentValue.length} items`}
              />

              {onEdit && (
                <div className="toolbar">
                  <button
                    className="item ui noborder button"
                    onClick={() => onEdit(id, schema)}
                  >
                    <Icon name="write square" size="large" color="blue" />
                  </button>
                  <button
                    aria-label="Delete"
                    className="item ui noborder button"
                    onClick={() => onDelete(id)}
                  >
                    <Icon name="close" size="large" color="red" />
                  </button>
                </div>
              )}

              <Button
                onClick={(e) => {
                  console.log('currentValue.length', currentValue.length); // TODO: 2 but in the render() of FlatObjectList I have 1

                  setOpen(true);
                }}
              >
                {/* TODO: instead of px use rem if possible */}
                <VoltoIcon name={penSVG} size="18px" />
              </Button>

              {map(error, (message) => (
                <Label key={message} basic color="red" pointing>
                  {message}
                </Label>
              ))}
            </Grid.Column>
          </Grid.Row>
          {description && (
            <Grid.Row stretched>
              <Grid.Column stretched width="12">
                <p className="help">{description}</p>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Form.Field>
    </>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ObjectListWidget.propTypes = {
  id: PropTypes.any.isRequired,
  schema: PropTypes.object.isRequired,
  error: PropTypes.any.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  fieldSet: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
ObjectListWidget.defaultProps = {
  value: [],
};

export default ObjectListWidget;
