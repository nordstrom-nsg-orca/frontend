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

// DEFAULT
// const schema = JSON.parse('{"$id":"test","$schema":"test","title":"test","type":"object","properties":{"name":{"type":"string"},"vendor":{"type":"string"},"ips":{"type":"array","items":{"type":"object","required":["ip"],"properties":{"description":{"type":"string"},"ip":{"type":"string"},"delete":{"type":"boolean"}}}}}}');
// const data = JSON.parse('[{"name":"test ACL","vendor":"arube","ips":[{"description":"test item","ip":"10.10.10.10/32","delete":true},{"description":"test item","ip":"10.10.10.10/32","delete":true},{"description":"test item","ip":"10.10.10.10/32","delete":true}]}]');

//SHORT
// const schema = JSON.parse('{"$id":"test","$schema":"test","title":"test","type":"object","properties":{"name":{"type":"string"}}}');
// const data = JSON.parse('[{"name":"test ACL"}]');

//LONG
const data = JSON.parse('[{"name":"test ACL","vendor":"arube","ips":[{"name":"halo","ip":"10.10.10.01.10"},{"name":"halo","ip":"10.10.10.01.10"},{"name":"halo","ip":"10.10.10.01.10"},{"name":"halo","ip":"10.10.10.01.10"},{"name":"halo","ip":"10.10.10.01.10"},{"name":"halo","ip":"10.10.10.01.10"},{"name":"halo","ip":"10.10.10.01.10"},{"name":"halo","ip":"10.10.10.01.10"},{"name":"halo","ip":"10.10.10.01.10"},{"name":"halo","ip":"10.10.10.01.10"},{"name":"halo","ip":"10.10.10.01.10"},{"name":"halo","ip":"10.10.10.01.10"},{"name":"halo","ip":"10.10.10.01.10"}]}]')
const schema = JSON.parse('{"$id":"test","$schema":"test","title":"test","type":"object","properties":{"name":{"type":"string"},"vendor":{"type":"string"},"ips":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"ip":{"type":"string"}}}}}}');

// DEEP
// const schema = JSON.parse('{"$id":"test","$schema":"test","title":"test","type":"object","properties":{"name":{"type":"string"},"anothercase":{"type":"object","properties":{"object":{"type":"string"},"another":{"type":"string"}}},"ips":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"description":{"type":"array","items":{"type":"string"}}}}}}}')
// const data = JSON.parse('[{"name":"test ACL","anothercase":{"object":"testing","another":"one"},"ips":[{"name":"halo","description":["one","two","three"]},{"name":"alpha","description":["onasdfe","two","three"]},{"name":"seven","description":["one","two","tsfasdhree"]}]}]')



class SchemaDataPage extends React.Component {
  state = { data };

  // onValueChange = event => {
  //   console.log(event);
  // }
  // onKeyDown = event => {
  // }
  
  addItem = (path, schema) => {
    const copy = [...data];

    let newItem;
    if (schema.type === 'object') {
      newItem = {};
      for (let [k, v] of Object.entries(schema.properties)){
        if (v.type === 'array')
          newItem[k] = [];
        else
          newItem[k] = null;
      }
    }

    console.log(schema);
    console.log(newItem);

    let item = this.getItemFromPath(copy, path);
    item.push(newItem);
    
    this.setState({ data: copy })
  }

  getItemFromPath = (obj, path) => {
    for (let j = 0; j < path.length; j++)
      obj = obj[path[j]];
    return obj;
  }

  removeItem = (path, index) => {
    const copy = [...data];
    let item = this.getItemFromPath(copy, path);
    delete item[index];
    this.setState({ data: copy })
  }

  render () {
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <Typography variant='h4'>
            {this.props.title}
          </Typography>

          <div style={{ marginLeft: 'auto' }}>

            <TextField
              size='small'
              label='search'
              variant='outlined'
              onChange={this.handleSearch}
            />
          </div>
        </div>


        <Paper style={{padding: '10px'}}>
          <TABLE
            data={this.state.data}
            schema={schema}
            addItem={this.addItem}
            removeItem={this.removeItem}
          />
        </Paper>
      </div>
    );
  }
}

export default SchemaDataPage;
