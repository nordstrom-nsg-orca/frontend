import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism-dark.css';

// DEFAULT
const schema = JSON.parse('{"$id":"test","$schema":"test","title":"test","type":"object","properties":{"name":{"type":"string"},"ips":{"type":"array","items":{"type":"object","required":["ip"],"properties":{"description":{"type":"string"},"ip":{"type":"string"},"delete":{"type":"boolean"}}}}}}');
const data = JSON.parse('[{"name":"test ACL","ips":[{"description":"test item","ip":"10.10.10.10/32","delete":true},{"description":"test item","ip":"10.10.10.10/32","delete":true},{"description":"test item","ip":"10.10.10.10/32","delete":true}]}]');

//SHORT
// const schema = JSON.parse('{"$id":"test","$schema":"test","title":"test","type":"object","properties":{"name":{"type":"string"}}}');
// const data = JSON.parse('[{"name":"test ACL"}]');

// DEEP
// const schema = JSON.parse('{"$id":"test","$schema":"test","title":"test","type":"object","properties":{"name":{"type":"string"},"ips":{"type":"array","items":{"type":"object","required":["ip"],"properties":{"description":{"type":"array","items":{"type":"string"}}}}}}}')
// const data = JSON.parse('[{"name":"test ACL","ips":[{"description":["one","two","three"]},{"description":["onasdfe","two","three"]},{"description":["one","two","tsfasdhree"]}]}]')

const Arr = (props) => {
  // console.log('Arr');
  // console.log(props);
  const space = props.space + 4;
  return (
    <div style={{}}>
      <Field {...props} name={props.name} input={false} j={0} />
      <div style={{marginLeft: `${4*8}px`}}>
        {props.data.map((d) => (
          <div>
            
            <IconButton
              tabIndex="-1"
              style={{marginLeft:'-20px', float:'left'}}
              size='small'
              onClick={event => console.log('hey')}
            >
              <RemoveIcon style={{fontSize:'0.875rem'}}/>
            </IconButton>
            
            {props.schema.type === 'object' ? (
              <Obj {...props} data={d} />
            ) : (
              <Field {...props} name={null} val={d} />
            )}
          </div>
        ))}

        <IconButton
          style={{marginLeft:'-20px'}}
          size='small'
          onClick={props.addArray.bind(this, props.path, props.schema)}
        >
          <AddIcon style={{fontSize:'0.875rem'}} />
        </IconButton>
      </div>
    </div>
  );
}

const Field = (props) => {
  return (
    <div style={{fontFamily: '"Fira code", "Fira Mono", monospace', fontSize: 16, whiteSpace: 'pre'}}>
      {props.name && (
        <span style={{marginRight: '8px'}}><span style={{color:'#26c6da'}}>{props.name}</span>:</span>
      )}
      {props.input !== false && (
        <InputBase
          style={{fontFamily: 'inherit', width: '100%', padding: '0px'}}
          inputProps={{ 'aria-label': 'naked', style: {padding: '0px'}}}
          defaultValue={props.val}
        />
      )}
    </div>
  )
}

const Obj = (props) => {
  // console.log('Obj');
  // console.log(props);
  return (
    Object.entries(props.schema.properties).map(([propName, prop], j) => (
        <div key={j} style={{}}>
          {prop.type === 'array' ? (
            <Arr
              {...props}
              data={props.data[propName]}
              name={propName}
              path={props.path.concat([propName])}
              schema={prop.items}
            />
          ) : (
            <Field
              {...props}
              name={propName}
              val={props.data[propName]}
            />
          )}
        </div>
    ))
  );  
}

class Dashboard extends React.Component {
  state = { data };

  onValueChange = event => {
    console.log(event);
  }
  onKeyDown = event => {
  }
  addArray = (path, schema) => {
    const copy = {...data};
    console.log(path);
    console.log(schema);
    const newItem = {}
    for (let i of Object.keys(schema.properties))
      newItem[i] = null;
    // console.log(newItem);
    
    let item = copy[path[0]];
    console.log(item);
    for (let j = 1; j < path.length; j++)
      item = item[path[j]];
    item.push(newItem);
    console.log(copy);
  }

  render () {
    return (
      <div>
        <Paper style={{padding: '10px'}}>
          {this.state.data.map((item, i) => (
            schema.type === 'object' && (
              <Obj
                key={i}
                data={item}
                onKeyDown={this.onKeyDown}
                onValueChange={this.onValueChange}
                addArray={this.addArray}
                schema={schema}
                path={[i]}
              />
            )
          ))}
        </Paper>
      </div>
    );
  }
}

export default Dashboard;
