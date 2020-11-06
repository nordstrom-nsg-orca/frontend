import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';

const font = {
  fontFamily: '"Fira code","Fira Mono", monospace',
  fontSize: 16,
  whiteSpace: 'pre'
};

class YAML extends React.Component {

  // componentDidMount () {
  //   console.log(this.props);
  // }

  // shouldComponentUpdate(nextProps) {
  //   // if (this.props.edit) {
  //   //   console.log("On Edit")
  //   //   return this.props.data !== nextProps.data;
  //   // } else {
  //   //   return true;
  //   // }
  // }

  render () {
    return (
      this.props.schema.type === 'object' && (
        <div style={{ ...font, padding: '8px' }}>
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
        // TODO FIX ALL THESE WEIRD KEYS I MADE BEFORE I KNEW YOU COULD DO THIS
        //      <div key={item}>
        <div key={(props.data.length) * (i + 1)} style={{ marginBottom: '5px' }}>
          <IconButton
            tabIndex='-1'
            style={{ marginLeft: '-20px', float: 'left' }}
            size='small'
            onClick={props.removeIndex.bind(this, props.path, i)}
          >
            {props.edit === true ? (
              <ClearIcon style={{ fontSize: '0.875rem' }} />
            ) : (
              <RemoveIcon style={{ fontSize: '0.875rem' }} />
            )}
          </IconButton>

          {props.schema.type === 'object' ? (
            <Obj {...props} data={item} path={props.path.concat([i])} />
          ) : (
            <Input
              onBlur={props.onBlur}
              val={item}
              itemKey={i}
              path={props.path}
              schema={props.schema}
              edit={props.edit}
            />
          )}
        </div>
      ))
    }


      {props.edit === true && (
        <IconButton
          style={{ marginLeft: '-20px' }}
          size='small'
          onClick={props.addIndex.bind(this, props.path, props.schema)}
        >
          <AddIcon style={{ fontSize: '0.875rem' }} />
        </IconButton>
      )}
    </div>
  );
};

// Label return the property name AND the value if not in edit mode
const Label = (props) => {
  return (
    <span style={{ marginRight: '8px' }}>
      {typeof props.name !== 'undefined' ? (
        <span><span style={{ color: '#26c6da' }}>{props.name}</span>:</span>
      ) : (
        <span>{String(props.val)}</span>
      )}

    </span>
  );
};

// key is needed in order to know the value has changed for a rerender
const Input = (props) => {

  if (!props.edit) {
    return (
      <Label val={props.val}/>
    );
  // if it is an ENUM, render a select with the options
  } else if (Array.isArray(props.schema.enum)) {
    return (
      <Select
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          getContentAnchorEl: null
        }}
        disableUnderline
        style={{ fontFamily: 'inherit' }}
        SelectDisplayProps={{ style: { padding: '0px 24px 0px 0px' } }}
        onChange={props.selectChange.bind(this, props.path, props.itemKey, props.schema, props.val)}
        value={props.val}
      >
        {props.schema.enum.map(item => (
          <MenuItem style={{ ...font, cursor: 'pointer' }} value={item}>{item}</MenuItem>
        ))}
      </Select>
    );
  } else if (props.schema.type === 'boolean') {
    return (
      <Select
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          getContentAnchorEl: null
        }}
        disableUnderline
        style={{ fontFamily: 'inherit' }}
        SelectDisplayProps={{ style: { padding: '0px 24px 0px 0px' } }}
        onChange={props.selectChange.bind(this, props.path, props.itemKey, props.schema, props.val)}
        value={props.val}
      >
        <MenuItem style={{ ...font, cursor: 'pointer' }} value={true}>true</MenuItem>
        <MenuItem style={{ ...font, cursor: 'pointer' }} value={false}>false</MenuItem>
      </Select>
    );
  } else {
    return (
      <InputBase
        style={{ fontFamily: 'inherit', width: '80%', padding: '0px' }}
        inputProps={{ 'aria-label': 'naked', style: { padding: '0px' } }}
        onBlur={props.onBlur.bind(this, props.path, props.itemKey, props.schema)}
        defaultValue={props.val}
        schema='test'
        key={props.val}
      />
    );
  }
};

const Obj = (props) => {
  return (
    props.schema.order.map((propName, i) => {
      let prop = props.schema.properties[propName];

      // onlyIf is used to only require a field base on the value of another
      // currently only used by Schema Schema (type=array => require)
      // NEEDS TO BE BEFORE $REF CHECK TO AVOID INFINITE LOOP (self ref schemas)
      if (prop.onlyIf) {
        const key = Object.keys(prop.onlyIf)[0];
        if (props.data[key] !== prop.onlyIf[key])
          return;
      }

      // if the prop is a reference, get the referenced object
      if (prop.$ref)
        prop = props.getRef(prop.$ref);

      // UUIDS are only defined for schemas made from the API
      const labelName = (typeof prop.name !== 'undefined') ? prop.name : propName;

      return (
        <div key={prop.data}>
          <Label name={labelName} />
          {prop.type === 'array' ? (
            <div style={{ marginLeft: `${4 * 8}px` }}>
              <Arr
                {...props}
                data={props.data[propName] || []}
                name={propName}
                path={props.path.concat([propName])}
                schema={prop.items}
              />
            </div>
          ) : prop.type === 'object' ? (
            <div style={{ marginLeft: `${4 * 8}px` }}>
              <Obj
                {...props}
                data={props.data[propName] || {}} // TODO FIX NULL DATA
                name={propName}
                path={props.path.concat([propName])}
                schema={prop}
              />
            </div>
          ) : ['integer', 'boolean', 'string'].includes(prop.type) ? (
            <Input
              onBlur={props.onBlur}
              selectChange={props.selectChange}
              val={props.data[propName]}
              itemKey={propName}
              path={props.path}
              schema={prop}
              edit={props.edit}
            />
          ) : (
            <div>ERROR - UNKNOWN type</div>
          )}
        </div>
      );
    })
  );
};

export default YAML;
