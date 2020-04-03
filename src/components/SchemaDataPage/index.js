import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
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
      id: 240
    };

  }

  componentDidMount = async () => {
    await this.loadData();
  }

  loadData = async () => {
    const schema = await API.GET(`schemas/${this.state.id}`);
    const data = await API.GET(`schemas/${this.state.id}/items`);
    this.setState({
      data: data, 
      schema: schema[0]['schema']
    });
  }
  
  saveData = async () => {
    console.log('save');
  }

  addItem = () => {
    const copy = [...this.state.data];
    const newItem = {
      id: 'POST',
      schemaid: this.state.id,
      data: this.buildObject(this.state.schema)
    }
    copy.push(newItem);
    this.setState({ data: copy })
  }

  buildObject = (schema) => {
    console.log(schema);
    const newItem = {};
    for (let [k, v] of Object.entries(schema.properties)){
      if (v.type === 'object')
        newItem[k] = this.buildObject(v.properties)
      else if (v.type === 'array')
        newItem[k] = [];
      else
        newItem[k] = null;
    }
  }

  // adds the object defined inside schema to data[path]
  addObject = (path, schema) => {
    // return;
    const copy = [...this.state.data];

    const newItem = this.buildObject(schema);

    let item = this.getItemFromPath(copy, path);
    item.push(newItem);
    
    this.setState({ data: copy })
  }

  // returns the item from obj[path[0]][path[1]]...
  getItemFromPath = (obj, path) => {
    for (let j = 0; j < path.length; j++)
      obj = obj[path[j]];
    return obj;
  }

  removeItem = (path, index) => {
    const copy = [...this.state.data];
    let item = this.getItemFromPath(copy, path);
    delete item[index];
    this.setState({ data: copy })
  }

  render () {
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


        {this.state.data.length == 0 && (
          <Paper style={{padding: '10px', textAlign: 'center'}}>
            <Typography>
            There doesn't appear to be anything here yet. Click the + to add an item!
            </Typography>
          </Paper>
        )}        
        
        {this.state.data.map((item, i) => (
          <Paper style={{padding: '10px', marginTop: '10px'}}>
            <View
              edit={this.state.edit}
              data={item.data}
              schema={this.state.schema}
              addObject={this.addObject}
              removeItem={this.removeItem}
              path={[i]}
            />
          </Paper>
        ))}

        {this.state.edit === true && (
          <div style={{display: 'flex', marginTop: '10px', justifyContent: 'center'}}>
          <IconButton onClick={this.addItem}>
            <AddIcon />
          </IconButton>
          </div>
        )}
      </div>
    );
  }
}

export default SchemaDataPage;
