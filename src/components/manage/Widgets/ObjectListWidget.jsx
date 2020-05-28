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
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon as VoltoIcon } from '@plone/volto/components';
import deleteSVG from '@plone/volto/icons/delete.svg';
import penSVG from '@plone/volto/icons/pen.svg';
import addSVG from '@plone/volto/icons/add.svg';

import ObjectWidget from './ObjectWidget';

export const FlatObjectList = ({ id, value = [], schema, onChange }) => {
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
                  key={index}
                  schema={schema}
                  value={obj}
                  onChange={(fi, fv) =>
                    onChange(
                      id,
                      value.map((v, i) =>
                        i !== index ? v : { ...v, [fi]: fv },
                      ),
                    )
                  }
                />
              </Segment>
            </Grid.Column>
            <Grid.Column width={1}>
              <Button.Group>
                <Button
                  basic
                  circular
                  size="mini"
                  onClick={() =>
                    onChange(
                      id,
                      value.filter((v, i) => i !== index),
                    )
                  }
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

export const ModalObjectListForm = (props) => {
  const {
    open,
    title,
    className,
    onSave,
    onCancel,
    schema,
    id,
    value = [],
  } = props;

  const empty = {};

  const [stateValue, setStateValue] = useState(value);

  return (
    <Modal open={open} className={className}>
      <Header>{title}</Header>
      <Modal.Content scrolling>
        <FlatObjectList
          {...props}
          value={stateValue}
          onChange={(id, v) => setStateValue(v)}
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
          onClick={() => setStateValue([...stateValue, empty])}
        >
          {/* TODO: instead of px use rem if possible */}
          <VoltoIcon size="20px" name={addSVG} />
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
          onClick={() => onSave(id, stateValue)}
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
          onClick={onCancel}
        />
      </Modal.Actions>
    </Modal>
  );
};

const ObjectListWidget = (props) => {
  const [open, setOpen] = useState(false);
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

  return (
    <>
      <ModalObjectListForm
        {...props}
        open={open}
        onSave={(id, value) => {
          setOpen(false);
          onChange(id, value);
        }}
        onCancel={() => setOpen(false)}
      />
      <Form.Field
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

              <Input
                id={`field-${id}`}
                name={id}
                disabled={true}
                icon={penSVG}
                value={`A collection of ${value.length} items`}
              />
              <button onClick={() => setOpen(true)}>
                {/* TODO: instead of px use rem if possible */}
                <VoltoIcon name={penSVG} size="18px" />
              </button>

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
