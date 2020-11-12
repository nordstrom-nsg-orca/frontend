import yaml from 'yaml';

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
// import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import API from 'util/api.js';
// import style from './style.js';
/*
TODO
    REMOVE ALL UNNEEDED ATTRIBUTES
        aria-labelledby, id, etc...
        lots of stuff in here isn't needed and can be reduced
    CLEAN UP LONG LINES (>100)
    IMPROVE READABILITY
        some of this is quite hard on the eyes
*/

class BulkView extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  insert = async (event) => {
    event.preventDefault();
    const str = event.target.insertInput.value;
    let parsed;
    const body = [];

    try {
      parsed = JSON.parse(str);
      // console.log(parsed);
      // isJSON = true;
    } catch (err) {
      try {
        parsed = yaml.parse(str);
        // console.log(parsed);
        // isJSON = false;
      } catch (err) {
        console.log('COULD NOT PARSE');
        this.props.handleInsert(false, 'Bad Data Format.');
        return;
      }
    }
    // console.log(parsed);
    const properties = this.props.schema.properties;
    // console.log(properties);
    const data = {};
    for (var key in parsed) {
      const value = parsed[key];
      for (var uuid in properties) {
        if (properties[uuid].name === key && properties[uuid].type === 'string')
          data[uuid] = value;
        else if (properties[uuid].name === key && properties[uuid].type === 'array') {
          data[uuid] = [];
          const childProperties = properties[uuid].items.properties;
          const reverseChildProperties = {};
          for (var childUUID in childProperties)
            reverseChildProperties[childProperties[childUUID].name] = childUUID;
          for (const eachValue of value) {
            const temp = {};
            for (const itemKey in eachValue)
              temp[reverseChildProperties[itemKey]] = eachValue[itemKey];
            data[uuid].push(temp);
          }
        }
      }
    }
    // console.log(data);
    body.push({
      httpMethod: 'POST',
      resource: '/schemas/{schemaId}/items',
      pathParameters: { schemaId: this.props.schemaId },
      body: data
    });
    // console.log(body);
    const resp = await API.POST('/bulk', body);
    console.log(resp);
    if ('id' in resp[0]) {
      console.log('Successfully added.');
      this.props.handleInsert(true);
    } else
      this.props.handleInsert(false, 'Invalid Schema.');

    // if (typeof parsed === 'object' || !parsed) {
    //   parsed = Object.values(parsed);
    //   console.log(parsed);
    // }
    // else if (!(parsed instanceof Array)) {
    //   error = true;
    //   this.setState({ insertError: error, errorData: null });
    //   return;
    // }

    // const newItem = this.props.buildObject(this.props.schema);
    // console.log(newItem);
    //
    // var properties;
    // var key;
    // for (var tempKey in newItem) {
    //   // console.log(tempKey);
    //   // console.log(this.props.schema.properties[tempKey]);
    //   if ('items' in this.props.schema.properties[tempKey]) {
    //     properties = this.props.schema.properties[tempKey].items.properties;
    //     key = tempKey;
    //   } else {
    //     console.log(this.props.schema.properties);
    //   }
    // }
    // console.log(properties);
    // console.log(key);
    // for (const item of parsed) {
    //   var temp = {};
    //   console.log(item);
    //   for (var uuid in properties)
    //     temp[uuid] = item[properties[uuid].name];
    //   console.log(temp);
    //   newItem[key].push(temp);
    // }
    // console.log(newItem);
    // body.push({
    //   httpMethod: 'POST',
    //   resource: '/schemas/{schemaId}/items',
    //   pathParameters: { schemaId: this.props.schemaId },
    //   body: newItem
    // });
    // console.log(body);
    // const resp = await API.POST('/bulk', body);
    // console.log(resp);
    // if ('id' in resp[0]) {
    //   console.log('Successfully added.');
    //   this.props.handleInsert(true);
    // } else
    //   this.props.handleInsert(false, 'Invalid Schema.');
  }

  handleTabCharacter = async (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const start = event.currentTarget.selectionStart;
      const end = event.currentTarget.selectionEnd;
      this.insertData.value = this.insertData.value.substring(0, start) + '    ' + this.insertData.value.substring(end);
      // put caret at right position again
      event.currentTarget.selectionStart = event.currentTarget.selectionEnd = start + 4;
    }
  }

  render () {
    const { classes } = this.props;

    return (
      <div>
        <Dialog
          aria-labelledby='customized-dialog-title'
          open={this.props.insert}
          fullWidth
          maxWidth='lg'
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogTitle
            id='customized-dialog-title'

          >
            <span style={{ fontFamily: 'monospace, monospace' }}> Insert Data (JSON/YAML) </span>
            <IconButton aria-label='close' className={classes.closeButton} onClick={this.props.closeInsert}>
              <CloseIcon />
            </IconButton>
            {(!this.props.errorData && this.props.insertError) &&
              <span style={{ color: 'red', fontFamily: 'monospace, monospace', fontWeight: 'bold' }}> Bad Data Format </span>}

            {(this.props.errorData && this.props.insertError) &&
              <span style={{ color: 'red', fontFamily: 'monospace, monospace', fontWeight: 'bold' }}> Failed to Insert Data </span>}

          </DialogTitle>
          <form onSubmit={this.insert} name='insert' id='insert'>
            <DialogContent classes={{ root: classes.dialogContent }}>
              <InputLabel style={{ fontWeight: 'bold', fontFamily: 'monospace, monospace', fontSize: 17 }}> DATA </InputLabel>
              <Input
                multiline
                fullWidth
                disableUnderline
                autoFocus
                type='text'
                name='insertInput'
                placeholder='Paste Your Data Here'
                inputProps={{
                  style: { fontSize: 15, letterSpacing: '0.1em', fontFamily: 'monospace, monospace', overflow: 'auto', minHeight: '45vh', maxHeight: '95vh' }
                }}
                onKeyDown={event => this.handleTabCharacter(event)}
              />
              {(this.props.errorData && this.props.insertError) &&
                <div>
                  <span style={{ fontWeight: 'bold', color: 'red', fontSize: 17, letterSpacing: '0.1em', fontFamily: 'monospace, monospace', marginTop: '10px' }}> Bad Lines Below: </span>
                  <Typography style={{ minHeight: '30vh', maxHeight: '30vh', overflow: 'auto' }}>
                    {this.props.errorData.map(err =>
                      <div style={{ fontSize: 15, letterSpacing: '0.1em', fontFamily: 'monospace, monospace' }} key={err.data}>
                        <pre>
                          {!err.isJSON ? yaml.stringify([err.data], { indent: 2, indentSeq: false, prettyErrors: true }) : JSON.stringify(err.data, null, 4)}
                        </pre>
                        <pre style={{ color: 'red' }}>
                          {yaml.stringify({ errors: err.errors }, { indent: 2, indentSeq: true, prettyErrors: true })}
                        </pre>
                      </div>)}
                  </Typography>
                </div>}

            </DialogContent>
            <DialogActions>
              <Button autoFocus type='submit' color='primary'>
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>

      </div>
    );
  }
}
BulkView.propTypes = {
  handleInsert: PropTypes.func.isRequired,
  // buildObject: PropTypes.func,
  schema: PropTypes.object,
  classes: PropTypes.object.isRequired,
  schemaId: PropTypes.number.isRequired,
  insert: PropTypes.bool.isRequired,
  closeInsert: PropTypes.func.isRequired,
  insertError: PropTypes.bool.isRequired,
  errorData: PropTypes.array
};

export default BulkView;

//   if (response.length === 0) {
//       this.setState({ insertError: true });
//       return;
//   }
//   let errors = [];
//   for (let i = 0; i < response.length; i++) {
//     const info = response[i];
//      if ('error' in info) {
//         error = true;
//         const temp = {
//           data: data[i]
//         };
//         temp.errors = info.error.message;
//         if (isJSON) {
//           // errors.push(JSON.stringify([temp], null, 2));
//           temp.isJSON = true;
//         } else {
//           temp.isJSON = false;
//           // errors.push(yaml.stringify([temp], { indent: 2, indentSeq: false, prettyErrors: true }));
//         }
//         errors.push(temp);
//      }
//   }
//   console.log(errors);
//   if (error) {
//      this.setState({ errorData: errors, insertError: error });
//   }
//
// if (!error) {
//   this.setState({ insert: false, insertError: false, insertData: null });
//   this.loadData();
// }
