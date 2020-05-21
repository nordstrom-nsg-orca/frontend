import React from 'react';
import yaml from 'yaml';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import YAML from 'components/SchemaDataPage/yaml.js';
import TABLE from 'components/SchemaDataPage/table.js';
import Bulk from 'components/SchemaDataPage/bulkView.js';
import API from 'util/api.js'

//TODO REMOVE STYLE FILE
import style from './style.js';




class SchemaDataPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      schema: {},
      yaml: true,
      edit: false,
      load: true,
      dialog: false,
      insert: false,
      insertError: false, //TODO is this needed?
      errorData: null,
      saveError: null
    };
    this.originalData = [];
  }

  componentDidMount = async () => {
    await this.loadData();
  }

  loadData = async () => {
    let schema, data;
    
    if (typeof this.props.id === 'number') { 
      schema = await API.GET(`/schemas/${this.props.id}`);
      data = await API.GET(`/schemas/${this.props.id}/items`);
    } else {
      schema = await API.GET('/schema');
      data = await API.GET('/schemas');
    }

    this.originalData = data;
    this.setState({
      data: data, 
      schema: schema,
      load: false
    });
  }
  
  // builds bulk reqeust from changes made to data
  saveData = async () => {
    const body = [];
    for (let i = 0; i < this.state.data.length; i++) {
      const item = this.state.data[i];
      
      // anything with a status has been modified.
      if (typeof item.status !== 'undefined') {
        
        // TODO clean up this if/else into a single block
        if (typeof this.props.id === 'number') {
          const request = { httpMethod: item.status, pathParameters: { schemaId: this.props.id }};        
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
          const request = { httpMethod: item.status };        
          request.resource = '/schemas';
          
          // no body needed in a DELETE
          if (item.status !== 'DELETE')
            request.body = item.data;

          // modifying item requires itemId
          if (['PUT', 'DELETE'].includes(item.status)) {
            request.resource += '/{schemaId}';
            request.pathParameters = { schemaId : item.id };
          }
          body.push(request);
        }
      }
    }
    
    const resp = await API.POST('/bulk', body);
    

    let error = false;
    for (const i of resp) {
      if (i.error) {
        error = true
        console.log('SAVE RESPONSE: ');
        console.log(JSON.stringify(resp, null, 2));
        break;
      }
    }
    
    this.setState({ dialog: true, saveError: error });
  }

  // adds a new item to the dataset
  addItem = () => {
    const copy = [...this.state.data];
    const newItem = {
      id: null,
      schemaid: this.props.id,
      data: this.buildObject(this.state.schema.schema),
      status: 'POST'
    }
    console.log('addItem newItem');
    console.log(newItem);
    copy.push(newItem);
    this.setState({ data: copy })
  }
  
  // flags an item for DELETE
  removeItem = (index) => {
    var copy = [...this.state.data];
    
    // a POST is a new row that hasn't been added yet, so it can't be deleted
    if (copy[index].status === 'POST')
      copy.splice(index,1);
    else
      copy[index].status = 'DELETE';
    
    this.setState({ data: copy });
  }

  // builds an empty dict of schema
  buildObject = (schema, stop = false) => {
    const newItem = {};
    let isRef = false;

    for (let [k, v] of Object.entries(schema.properties)){      

      // TODO
      // don't create items that are onlyIf, this protects from infinite loop with self ref schemas
      // BUG: when making a new schema, items/properties have left over vals from changing types, causing save errors
      if (v.onlyIf)
        continue;

      if (v.type === 'object') {
        console.log('object' + isRef)
        newItem[k] = this.buildObject(v, isRef)
        
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
    const copy = [...this.state.data];
    let item = this.getItemFromPath(path, copy, []);
    let newItem = null;
    
    if (schema.type == 'object')
      newItem = this.buildObject(schema);

    item.push(newItem);
    this.setState({ data: copy })
  }

  // removes an index from an Array
  removeIndex = (path, index) => {
    var copy = [...this.state.data];
    var item = this.getItemFromPath(path, copy);
    item.splice(index, 1);
    this.setState({ data: copy });
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
      this.setState({ data: copy });
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
      schema = schema[refs[i]]
    
    return schema;
  }

  render () {
    const View = this.state.yaml? YAML : TABLE;
    const { classes } = this.props;

    return (
      <div>
        <div style={{ display: 'flex', marginBottom: '15px' }}>
          <Typography variant='h4'>
            {this.props.name}
          </Typography>

          <div style={{ marginLeft: 'auto' }}>
            <Button value="SAVE" onClick={this.saveData}>SAVE</Button>
            {/* <Button value="VIEW" onClick={event => this.setState({yaml: !this.state.yaml})}>VIEW</Button> */}
            <Button value="EDIT" onClick={event => this.setState({edit: !this.state.edit})}>EDIT</Button>
            <Button value="BULK" onClick={event => this.setState({ insert: true })}>BULK</Button>
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

        {(this.state.data.length == 0 && !this.state.load) && (
          <Paper style={{padding: '10px', textAlign: 'center'}}>
            <Typography>
              There doesn't appear to be anything here yet. {this.state.edit ? 'Click the + to add an item!' : ''}
            </Typography>
          </Paper>
        )}        
        
        {this.state.data.map((item, i) => (
          item.status !== 'DELETE' && (
            <Paper style={{padding: '10px', marginTop: '10px'}} key={(this.state.data.length)*(i+1)}>
            {/* <Paper style={{padding: '10px', marginTop: '10px'}} key={item.data}></Paper> */}
              {this.state.edit == true && (
                <IconButton onClick={this.removeItem.bind(this, i)} style={{float: 'right'}}>
                  <ClearIcon />
                </IconButton>
              )}
              <View
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
          <div style={{display: 'flex', marginTop: '10px', justifyContent: 'center'}}>
          <IconButton onClick={this.addItem} style={{position: ''}}>
            <AddIcon />
          </IconButton>
          </div>
        )}

        <Dialog
          open={this.state.dialog}
          onClose={event => {this.setState({dialog: false}); this.loadData()}}
        >
          <DialogContent>
            <DialogContentText style={{color:'inherit'}}>
              {this.state.saveError === true ? (
                "Save failed. Invalid Schema. View console for more information"
              ) : (
                "Save successful" 
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
          classes={classes}
          insert={this.state.insert}
          insertError={this.state.insertError}
          errorData={this.state.errorData}
          closeInsert={event => this.setState({insert:false})}
        />

      </div>
    );
  }
}

export default withStyles(style)(SchemaDataPage);
