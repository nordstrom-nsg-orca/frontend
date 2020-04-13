import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';

import YAML from 'components/SchemaDataPage/yaml.js';
import TABLE from 'components/SchemaDataPage/table.js';

import API from 'util/api.js'


class SchemaDataPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      schema: {},
      yaml: true,
      edit: true,
      load: true,
      id: 240
    };
    this.originalData = [];
  }

  componentDidMount = async () => {
    await this.loadData();
  }

  loadData = async () => {
    const schema = await API.GET(`/schemas/${this.state.id}`);
    const data = await API.GET(`/schemas/${this.state.id}/items`);
    this.originalData = data;
    this.setState({
      data: data, 
      schema: schema['schema'],
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
        const request = { httpMethod: item.status, pathParameters: { schemaId: this.state.id }};        
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
      }
    }
    console.log(body);
    const resp = await API.POST('/bulk', body);
    console.log(resp);
    // const response = await API.BULK(body);
  }

  // adds a new item to the dataset
  addItem = () => {
    const copy = [...this.state.data];
    const newItem = {
      id: null,
      schemaid: this.state.id,
      data: this.buildObject(this.state.schema),
      status: 'POST'
    }
    copy.push(newItem);
    this.setState({ data: copy })
  }
  
  // flags an item for DELETE
  removeItem = (index) => {
    var copy = [...this.state.data];
    copy[index].status = 'DELETE';
    this.setState({ data: copy });
  }

  // builds an empty dict of schmea
  buildObject = (schema) => {
    const newItem = {};
    for (let [k, v] of Object.entries(schema.properties)){
      if (v.type === 'object')
        newItem[k] = this.buildObject(v)
      else if (v.type === 'array')
        newItem[k] = [];
      else
        newItem[k] = null;
    }
    return newItem;
  }

  // returns the item from obj[path[0]][path[1]]...
  getItemFromPath = (obj, path) => {
    obj[path[0]].status = obj[path[0]].status || 'PUT';
    
    for (let j = 0; j < path.length; j++)
      obj = obj[path[j]];
    return obj;
  }

  // adds the object defined inside schema to an Array
  addIndex = (path, schema) => {
    const copy = [...this.state.data];
    const newItem = this.buildObject(schema);
    let item = this.getItemFromPath(copy, path);
    item.push(newItem);
    this.setState({ data: copy })
  }

  // removes an index from an Array
  removeIndex = (path, index) => {
    var copy = [...this.state.data];
    var item = this.getItemFromPath(copy, path);
    item.splice(index, 1);
    this.setState({ data: copy });
  }

  // updates data on exit focus
  onBlur = (path, key, event) => {
    const target = event.target;
    
    if (target.value !== target.defaultValue) {
      var copy = [...this.state.data];
      var item = this.getItemFromPath(copy, path);
      item[key] = target.value;
      this.setState({ data: copy });
    }
  }


  render () {
    console.log(this.state.data);

    const View = this.state.yaml? YAML : TABLE;
    return (
      <div>
        <div style={{ display: 'flex', marginBottom: '15px' }}>
          <Typography variant='h4'>
            {this.props.title}
          </Typography>

          <div style={{ marginLeft: 'auto' }}>
            <Button value="SAVE" onClick={this.saveData}>SAVE</Button>
            <Button value="VIEW" onClick={event => this.setState({yaml: !this.state.yaml})}>VIEW</Button>
            <Button value="EDIT" onClick={event => this.setState({edit: !this.state.edit})}>EDIT</Button>
            <TextField
              size='small'
              label='search'
              variant='outlined'
              onChange={this.handleSearch}
            />
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
            There doesn't appear to be anything here yet. Click the + to add an item!
            </Typography>
          </Paper>
        )}        
        
        {this.state.data.map((item, i) => (
          item.status !== 'DELETE' && (
            <Paper style={{padding: '10px', marginTop: '10px'}} key={(this.state.data.length)*(i+1)}>
              {this.state.edit == true && (
                <IconButton onClick={this.removeItem.bind(this, i)} style={{float: 'right'}}>
                  <ClearIcon />
                </IconButton>
              )}
              <View
                edit={this.state.edit}
                data={item.data}
                schema={this.state.schema}
                addIndex={this.addIndex}
                removeIndex={this.removeIndex}
                onBlur={this.onBlur}
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
      </div>
    );
  }
}

export default SchemaDataPage;
