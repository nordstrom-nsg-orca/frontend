import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';


class YAML extends React.Component {
  render() {
    return (
      this.props.schema.type === 'object' && (
        <div style={{
            fontFamily: '"Fira code","Fira Mono", monospace',
            fontSize: 16,
            whiteSpace: 'pre'
          }}>
          <Obj {...this.props} />
        </div>
      )
    );
  }
}

const Arr = (props) => {
  return (
    <div style={{}}>
      {props.data.map((item, i) => (
        <div key={(props.data.length)*(i+1)}>
          <IconButton
            tabIndex="-1"
            style={{marginLeft:'-20px', float:'left'}}
            size='small'
            onClick={props.removeIndex.bind(this, props.path, i)}
          >
            {props.edit === true ? (
              <ClearIcon style={{fontSize:'0.875rem'}}/>
            ) : (
              <RemoveIcon style={{fontSize:'0.875rem'}}/>
            )}
          </IconButton>
          
          {props.schema.type === 'object' ? (
            <Obj {...props} data={item} path={props.path.concat([i])}/>
          ) : (
            <Input onBlur={props.onBlur} val={item} itemKey={i} path={props.path} />
          )}
        </div>
      ))}

      {props.edit === true && (
      <IconButton
        style={{marginLeft:'-20px'}}
        size='small'
        onClick={props.addIndex.bind(this, props.path, props.schema)}
      >
        <AddIcon style={{fontSize:'0.875rem'}} />
      </IconButton>
      )}
    </div>
  );
}

const Label = (props) => {
  return (
    <span style={{marginRight: '8px'}}>
      <span style={{color:'#26c6da'}}>{props.name}</span>:
    </span>
  );
}

// key is needed in order to know the value has changed for a rerender
const Input = (props) => {
  return (
    <InputBase
      style={{fontFamily: 'inherit', width: '80%', padding: '0px'}}
      inputProps={{ 'aria-label': 'naked', style: {padding: '0px'}}}
      onBlur={props.onBlur.bind(this, props.path, props.itemKey)}
      defaultValue={props.val}
      key={props.val}
    />
  )
}

const Obj = (props) => {
  return (
    Object.entries(props.schema.properties).map(([propName, prop], j) => (
      <div key={j+props.schema.properties.length}>
        <Label name={propName} />
        {prop.type === 'array' ? (
          <div style={{marginLeft: `${4*8}px`}}>
          <Arr
            {...props}
            data={props.data[propName]}
            name={propName}
            path={props.path.concat([propName])}
            schema={prop.items}
          />
          </div>
        ) : prop.type === 'object' ? (
        <div style={{marginLeft: `${4*8}px`}}>
          <Obj
            {...props}
            data={props.data[propName]}
            name={propName}
            path={props.path.concat([propName])}
            schema={prop}
          />
          </div>
        ) : ( 
          <Input
            onBlur={props.onBlur}
            val={props.data[propName]}
            itemKey={propName}
            path={props.path}
          />
        )}
      </div>
    ))
  );  
}


export default YAML;