import React from 'react';
// import yaml from 'yaml';
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
// import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import InsertDriveFileRoundedIcon from '@material-ui/icons/InsertDriveFileRounded';

import YAML from 'components/SchemaDataPage/yaml.js';
import TABLE from 'components/SchemaDataPage/table.js';
import Bulk from 'components/SchemaDataPage/bulkView.js';
import API from 'util/api.js';

// TODO REMOVE STYLE FILE
import style from './style.js';

class SchemaDataPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: [],
      schema: {},
      yaml: true,
      edit: false,
      load: true,
      dialog: false,
      insert: false,
      insertError: false, // TODO is this needed?
      errorMessage: null,
      errorData: null,
      saveError: null,
      changes: false,
      unsavedData: null
    };
    this.initail = this.state;
    this.originalData = [];
  }

  componentWillUnmount = async () => {
    if (this.state.changes) {
      console.log('I dont want to leave');
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        // This is the hard part. You can naively say "go back", but you can't be 100% sure
        // that will take them to the location they came from. It's just a guess.
        // this.props.history.push(this.props.location.pathname);
        localStorage.setItem('schemaState', JSON.stringify(this.state));
        this.props.history.goBack();
      } else
        localStorage.setItem('schemaState', null);
    } else {
      this.props.history.goForward();
      localStorage.setItem('schemaState', null);
      console.log(this.props.history);
    }
  }

  componentDidMount = async () => {
    await this.loadData();
    // console.log(this.state);
  }

  loadData = async () => {
    let schema, data;
    let changes = false;
    const previousState = await JSON.parse(localStorage.getItem('schemaState'));
    console.log(previousState);
    if (previousState && previousState.unsavedData) {
      data = previousState.unsavedData;
      schema = previousState.schema;
      changes = true;
      console.log('reloading unsaved data');
    } else if (typeof this.props.id === 'number') {
      schema = await API.GET(`/schemas/${this.props.id}`);
      data = await API.GET(`/schemas/${this.props.id}/items`);
    } else {
      schema = await API.GET('/schema');
      data = await API.GET('/schemas');
    }

    this.originalData = data;
    console.log(data);
    this.setState({
      data: data,
      schema: schema,
      load: false,
      changes: changes,
      unsavedData: changes ? data : null
    });
  }

  // builds bulk reqeust from changes made to data
  saveData = async () => {
    const body = [];
    const data = this.state.data;
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      // const request = {
      //   resource: '/schemas/{schemaId}/items',
      //   pathParameters: { schemaId: this.state.id }
      // };
      // anything with a status has been modified.
      if (typeof item.status !== 'undefined') {
        // TODO clean up this if/else into a single block
        if (typeof this.props.id === 'number') {
          const request = { httpMethod: item.status, pathParameters: { schemaId: this.props.id } };
          request.resource = '/schemas/{schemaId}/items';

          // no body needed in a DELETE
          if (item.status !== 'DELETE')
            request.body = item.data;

          // modifying item requires itemId
          if (['PUT', 'DELETE'].includes(item.status)) {
            request.resource += '/{itemId}';
            request.pathParameters.itemId = item.id;
          }
          body.push(request);
        } else {
          console.log('deleting');
          const request = { httpMethod: item.status };
          request.resource = '/schemas';

          // no body needed in a DELETE
          if (item.status !== 'DELETE')
            request.body = item.data;

          // modifying item requires itemId
          if (['PUT', 'DELETE'].includes(item.status)) {
            request.resource += '/{schemaId}';
            request.pathParameters = { schemaId: item.id };
          }
          body.push(request);
        }
      }
      // console.log(request);
    }
    // console.log(body)
    const resp = await API.POST('/bulk', body);
    let error = false;
    for (const i of resp) {
      if (i.error) {
        error = true;
        console.log('SAVE RESPONSE: ');
        console.log(JSON.stringify(resp, null, 2));
        return;
      }
    }
    this.loadData();
    this.setState({ dialog: true, saveError: error, changes: false, unsavedData: null });
  }

  // adds a new item to the dataset
  addItem = () => {
    const copy = [...this.state.data];
    console.log(this.state.schema);
    const newItem = {
      id: null,
      schemaid: this.props.id,
      data: this.buildObject(this.state.schema.schema),
      status: 'POST'
    };
    console.log('addItem newItem');
    console.log(newItem);
    copy.push(newItem);
    console.log(copy);
    this.setState({ data: copy, changes: true, unsavedData: copy });
  }

  // flags an item for DELETE
  removeItem = (index) => {
    var copy = [...this.state.data];
    // console.log(copy);
    // a POST is a new row that hasn't been added yet, so it can't be deleted
    if (copy[index].status === 'POST')
      copy.splice(index, 1);
    else
      copy[index].status = 'DELETE';

    this.setState({ data: copy, changes: true, unsavedData: copy });
  }

  // builds an empty dict of schema
  buildObject = (schema, stop = false) => {
    const newItem = {};
    const isRef = false;

    for (const [k, v] of Object.entries(schema.properties)) {
      // TODO
      // don't create items that are onlyIf, this protects from infinite loop with self ref schemas
      // BUG: when making a new schema, items/properties have left over vals from changing types, causing save errors
      if (v.onlyIf)
        continue;

      if (v.type === 'object') {
        console.log('object' + isRef);
        newItem[k] = this.buildObject(v, isRef);
      } else if (v.type === 'array')
        newItem[k] = [];
      else
        newItem[k] = null;
    }
    return newItem;
  }

  // returns the item from obj[path[0]][path[1]]...
  // type is the default type if the obj is not found
  getItemFromPath = (path, obj, type) => {
    // this function only called when the something has changed, so mark object as changed
    obj[path[0]].status = obj[path[0]].status || 'PUT';

    for (let j = 0; j < path.length; j++) {
      if (obj[path[j]] == null) {
        obj[path[j]] = type;
        console.log('getItem NULL');
      }

      obj = obj[path[j]];
    }
    return obj;
  }

  // adds the object defined inside schema to an Array
  addIndex = (path, schema) => {
    console.log(path);
    const copy = [...this.state.data];
    const item = this.getItemFromPath(path, copy, []);
    let newItem = null;

    if (schema.type === 'object')
      newItem = this.buildObject(schema);

    item.push(newItem);
    console.log(item);
    console.log('Adding new stuffs');
    console.log(copy);
    this.setState({ data: copy, changes: true, unsavedData: copy });
  }

  // removes an index from an Array
  removeIndex = (path, index) => {
    var copy = [...this.state.data];
    var item = this.getItemFromPath(path, copy);
    item.splice(index, 1);
    this.setState({ data: copy, changes: true, unsavedData: copy });
  }

  // attempts to cast value as the datatype from path
  // TODO implement once regex and other things allowed.
  parseType = (value, schema) => {
    return value;
  }

  // updates the state key at path with value
  updateValue = (path, key, value, schema) => {
    const copy = [...this.state.data];
    var item = this.getItemFromPath(path, copy, {});

    try {
      const parsedValue = this.parseType(value, schema);
      item[key] = parsedValue;
      this.setState({ data: copy, changes: true, unsavedData: copy });
    // TODO alert error
    } catch (e) {
      console.log(e);
    }
  }

  // updates data on exit focus
  onBlur = (path, key, schema, event) => {
    const target = event.target;
    if (target.value !== target.defaultValue)
      this.updateValue(path, key, target.value, schema);
  }

  // whenever a select is clicked, update if new value
  selectChange = (path, key, schema, oldValue, event) => {
    const target = event.target;
    if (target.value !== oldValue)
      this.updateValue(path, key, target.value, schema);
  }

  // if there is a reference in a schema, return the reference object
  // this should only happen when creating new schemas
  getRef = (ref) => {
    const refs = ref.split('/');
    let schema = { ...this.state.schema.schema };

    for (var i = 1; i < refs.length; i++)
      schema = schema[refs[i]];

    return schema;
  }

  // handles bulk insert on save
  handleInsert = (success, message = null) => {
    if (success) {
      this.loadData();
      this.setState({ insert: false, dialog: true, saveError: false, changes: false });
    } else {
      // console.log('Im here');
      this.setState({ insert: true, dialog: true, saveError: true, errorMessage: message });
    }
  }

  render () {
    const View = this.state.yaml ? YAML : TABLE;
    const { classes } = this.props;

    return (
      <div>
        <div style={{ display: 'flex', marginBottom: '15px', fontFamily: 'monospace, monospace' }}>
          <Typography variant='h4'>
            {this.props.name}
          </Typography>

          <div style={{ marginLeft: 'auto' }}>

            <Button

              color={this.state.changes ? 'secondary' : 'primary'}
              size='small'
              value='SAVE'
              onClick={this.saveData}
              startIcon={<SaveRoundedIcon />}
              style={{ marginRight: '10px' }}
            >
              Save
            </Button>
            <Button

              value='BULK'
              size='small'
              onClick={event => this.setState({ insert: true })}
              color='primary'
              startIcon={<InsertDriveFileRoundedIcon />}
              style={{ marginRight: '10px' }}
            >
              BULK
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.edit}
                  onChange={event => this.setState({ edit: !this.state.edit })}
                  name='edit'
                  color='primary'
                />
              }
              label='EDIT'
            />
            {/* <TextField
              size='small'
              label='search'
              variant='outlined'
              onChange={this.handleSearch}
            /> */}
          </div>

        </div>

        {this.state.load && (
          <div align='center' style={{ paddingTop: '50px' }}>
            <CircularProgress />
          </div>
        )}

        {(!this.state.data && !this.state.load) && (
          <Paper style={{ padding: '10px', textAlign: 'center' }}>
            <Typography>
              There doesn't appear to be anything here yet. {this.state.edit ? 'Click the + to add an item!' : ''}
            </Typography>
          </Paper>
        )}
        {this.state.data.map((item, i) => (
          item.status !== 'DELETE' && (
            <Paper style={{ padding: '10px', marginTop: '10px' }} key={(this.state.data.length) * (i + 1)}>
              {/* <Paper style={{padding: '10px', marginTop: '10px'}} key={item.data}></Paper> */}
              {this.state.edit === true && (
                <IconButton onClick={this.removeItem.bind(this, i)} style={{ float: 'right' }}>
                  <ClearIcon />
                </IconButton>
              )}
              <View
                key={(this.state.data.length) * (i + 1)}
                edit={this.state.edit}
                data={item.data}
                schema={this.state.schema.schema}
                uuids={this.state.schema.uuids}
                getRef={this.getRef}
                addIndex={this.addIndex}
                removeIndex={this.removeIndex}
                onBlur={this.onBlur}
                selectChange={this.selectChange}
                path={[i, 'data']}
              />
            </Paper>
          )
        ))}

        {this.state.edit === true && (
          <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'center' }}>
            <IconButton onClick={this.addItem} style={{ position: '' }}>
              <AddIcon />
            </IconButton>
          </div>
        )}

        <Dialog
          open={this.state.dialog}
          onClose={event => { this.setState({ dialog: false }); this.loadData(); }}
        >
          <DialogContent>
            <DialogContentText style={{ color: 'inherit' }}>
              {this.state.saveError === true ? (
                'Save failed. ' + this.state.errorMessage
              ) : (
                'Save successful!'
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={event => this.setState({ dialog: false })}>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Bulk
          schemaId={this.props.id}
          schema={this.state.schema.schema}
          buildObject={this.buildObject}
          classes={classes}
          insert={this.state.insert}
          insertError={this.state.insertError}
          errorData={this.state.errorData}
          closeInsert={event => this.setState({ insert: false })}
          handleInsert={this.handleInsert}
        />

      </div>
    );
  }
}
SchemaDataPage.propTypes = {
  history: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired
};
export default withRouter(withStyles(style)(SchemaDataPage));
// <Button value="SAVE" onClick={this.saveData}> SAVE </Button>
// {/* <Button value="VIEW" onClick={event => this.setState({yaml: !this.state.yaml})}>VIEW</Button> */}
// <Button value="EDIT" onClick={event => this.setState({edit: !this.state.edit})}>EDIT</Button>
