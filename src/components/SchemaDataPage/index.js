import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Input from '@material-ui/core/Input';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';

import YAML from 'components/SchemaDataPage/yaml.js';
import TABLE from 'components/SchemaDataPage/table.js';

import API from 'util/api.js';
import style from './style.js';
import yaml from 'yamljs';


class SchemaDataPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      schema: {},
      yaml: true,
      edit: true,
      load: true,
      insert: false,
      insertError: false,
      insertData: null,
      id: 240
    };
    this.originalData = [];
  }

  componentDidMount = async () => {
    await this.loadData();
  }

  loadData = async () => {
    const schema = await API.GET(`/schemas/${this.state.id}`);
    console.log(schema);
    const data = await API.GET(`/schemas/${this.state.id}/items`);
    this.originalData = data;

    this.setState({
      data: data,
      schema: schema.schema,
      load: false
    });
  }

  // builds bulk reqeust from changes made to data
  saveData = async (bulkData) => {
    const body = [];
    let data;
    if (bulkData)
      data = bulkData;
    else
      data = this.state.data;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      const request = {
         resource: '/schemas/{schemaId}/items',
         pathParameters: { schemaId: this.state.id }
      };
      // anything with a status has been modified.
      if (typeof item.status !== 'undefined') {
        // const request = { httpMethod: item.status, pathParameters: { schemaId: this.state.id }};
        request.httpMethod = item.status
        // request.resource = '/schemas/{schemaId}/items';

        // no body needed in a DELETE
        if (item.status !== 'DELETE')
          request.body = item.data;

        // modifying item requires itemId
        if (['PUT', 'DELETE'].includes(item.status)) {
          request.resource += '/{itemId}';
          request.pathParameters.itemId = item.id;
        }
        body.push(request);
      } else if (bulkData) {
         request.httpMethod = 'POST';
         request.body = item;
         body.push(request);
      }
    }

    const options = {
      method: 'POST',
      data: body
    }
    const resp = await API.endpoint('/bulk', options);
    if (resp.status !== 200)
      return resp.json();
    return resp.json;
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

  // saves bulk insert
  handleInsert = async (event, isSave) => {
   event.preventDefault();
   let error = false;
    if (isSave) {
      console.log('Saving');
      // console.log(this.insertData.value);
      let data = null;
      let isJSON = true;

      try {
         data = JSON.parse(this.insertData.value);
      } catch (err) {
         // do something
      }

      // try parsing it as yaml
      try {
         data = yaml.parse(this.insertData.value);
         isJSON = false;
      } catch (err) {
         // console.log(err);
      }

      // verify data is an object and not null
      if (typeof data !== 'object' || !data) {
         error = true;
         this.setState({ insertError: error, insertData: null });
         return;
      }
      // console.log(data);
       // call Bulk API
      const response = await this.saveData(data);
      console.log(response);
      let errors = [];
      for (let i = 0; i < response.length; i++) {
        const info = response[i];
         if ('error' in info) {
            error = true;
            const temp = data[i];
            temp.errors = info.error.message;
            if (isJSON)
              errors.push(JSON.stringify([temp], null, 2));
            else
              errors.push(yaml.stringify([temp], 4));
         }
      }
      console.log(errors);
      if (error) {
         this.setState({ insertData: errors, insertError: error });
      }
    }

    if (!error)
      this.setState({ insert: false, insertError: false, insertData: null });
}

  render () {
    // console.log(this.state.data);
    const { classes } = this.props;
    const View = this.state.yaml ? YAML : TABLE;
    return (
      <div>
        <div style={{ display: 'flex', marginBottom: '15px' }}>
          <Typography variant='h4'>
            {this.props.title}
          </Typography>

          <div style={{ marginLeft: 'auto' }}>
            <Button value="SAVE" onClick={() => this.saveData(null)}>SAVE</Button>
            <Button value="VIEW" onClick={event => this.setState({ yaml: !this.state.yaml })}>VIEW</Button>
            <Button value="EDIT" onClick={event => this.setState({ edit: !this.state.edit })}>EDIT</Button>
            <Button value="INSERT" onClick={event => this.setState({ insert: true })}>INSERT</Button>

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

        {(this.state.data.length === 0 && !this.state.load) && (
          <Paper style={{padding: '10px', textAlign: 'center'}}>
            <Typography>
            There doesn't appear to be anything here yet. Click the + to add an item!
            </Typography>
          </Paper>
        )}
        {this.state.data.map((item, i) => (
          item.status !== 'DELETE' && (
            <Paper style={{padding: '10px', marginTop: '10px'}} key={(this.state.data.length)*(i+1)}>
              {this.state.edit === true && (
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



       <Dialog
         onClose={event => this.handleInsert(event, false)}
         aria-labelledby="customized-dialog-title"
         open={this.state.insert}
         fullWidth={true}
         maxWidth='lg'
         classes={{ paper: classes.dialogPaper }}
       >
         <DialogTitle id="customized-dialog-title" onClose={event => this.handleInsert(event, false)}>
           Insert Data (JSON/YAML)
           <IconButton aria-label="close" className={classes.closeButton} onClick={event => this.handleInsert(event, false)}>
             <CloseIcon />
           </IconButton>
           { (!this.state.insertData && this.state.insertError) &&

            <span style={{ color: 'red' }}> Bad data format </span>

           }

           { (this.state.insertData && this.state.insertError) &&

            <span style={{ color: 'red' }}> Failed to insert data </span>

           }
         </DialogTitle>
         <form onSubmit={event => this.handleInsert(event, true)} name='insert' id='insert' style={{ height: '500px' }}>
           <DialogContent classes={{ root: classes.dialogContent }}>
             <Input
               multiline
               fullWidth
               disableUnderline
               type='text'
               name='insertInput'
               inputRef={event => this.insertData = event}
               placeholder="Paste Your Data Here"
             />
           { (this.state.insertData && this.state.insertError) &&
            <Typography>
              <span style={{ fontWeight: 'bold' }}> Bad lines below: </span>
              <pre style={{ color: 'red' }}>
                {this.state.insertData}
              </pre>
            </Typography>}

           </DialogContent>
           <DialogActions>
             <Button autoFocus type='submit' color="primary">
               Save
             </Button>
           </DialogActions>
         </form>
        </Dialog>

      </div>
    );
  }
}

export default withStyles(style)(SchemaDataPage);
