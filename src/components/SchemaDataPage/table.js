import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


class TABLE extends React.Component {
  render() {
    return (
      this.props.schema.type === 'object' && (
        <Obj {...this.props} />
      )
    );
  }
}

const Arr = (props) => {
  // console.log('Arr');
  // console.log(props)
  return (
    <div></div>
  );
}

const Field = (props) => {
  return (
    <div>
    </div>
  )
}

const Obj = (props) => {
  // console.log('Obj');
  // console.log(props);
  return (
    <Table size='small' style={{width:"100%"}}>
      <TableHead>
        <TableRow>
          {Object.entries(props.schema.properties).map(([propName, prop], j) => (
              <TableCell style={{fontWeight:'bold', color:'#26c6da'}}>
                {propName}
              </TableCell>
          ))}
        </TableRow>
      </TableHead>
    
      {Array.isArray(props.data) ? (
        props.data.map((item, i) => (
          <TableRow>
          {Object.entries(props.schema.properties).map(([propName, prop], j) => (
            <TableCell>
              {item[propName]}
            </TableCell>
          ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          {Object.entries(props.schema.properties).map(([propName, prop], j) => (
            <TableCell>
            {prop.type === 'object' ? (
              <Obj
                {...props}
                data={props.data[propName]}
                schema={prop}
                path={props.path.concat([propName])}
                name={propName}
              />
            ) :  prop.type === 'array' && prop.items.type === 'object' ? (
            <div>
              <Obj
                {...props}
                data={props.data[propName]}
                schema={prop.items}
                name={propName}
                path={props.path.concat([propName])}
              />
              {props.edit === true && (
                <IconButton
                  style={{width:'100%', borderRadius:'0'}}
                  size='small'
                  onClick={props.addObject.bind(this, props.schema, props.path.concat([propName]))}
                >
                  <AddIcon style={{fontSize:'0.875rem'}} />
                </IconButton>
              )}
            </div>
            ) : (
              props.data[propName]
            )}
            </TableCell>
          ))}
        </TableRow>
      )}
    </Table>
  );  
}


export default TABLE;