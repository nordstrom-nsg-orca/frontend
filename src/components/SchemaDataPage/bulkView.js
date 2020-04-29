import React from 'react';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close'

import yaml from 'yaml';


class BulkView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleTabCharacter = async (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const start = event.currentTarget.selectionStart;
      const end = event.currentTarget.selectionEnd;
      console.log(start);
      console.log(end);
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
          aria-labelledby="customized-dialog-title"
          open={this.props.insert}
          fullWidth={true}
          maxWidth='lg'
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogTitle
            id='customized-dialog-title'
            onClose={event => this.props.handleInsert(event, null)}
          >
            <span style={{ fontFamily: 'monospace, monospace' }}> Insert Data (JSON/YAML) </span>
            <IconButton aria-label="close" className={classes.closeButton} onClick={event => this.props.handleInsert(event, null)}>
              <CloseIcon />
            </IconButton>
            {(!this.props.errorData && this.props.insertError) &&
             <span style={{ color: 'red', fontFamily: 'monospace, monospace', fontWeight: 'bold' }}> Bad Data Format </span>}

            {(this.props.errorData && this.props.insertError) &&
             <span style={{ color: 'red', fontFamily: 'monospace, monospace', fontWeight: 'bold' }}> Failed to Insert Data </span>}

          </DialogTitle>
          <form onSubmit={event => this.props.handleInsert(event, this.insertData)} name='insert' id='insert'>
            <DialogContent classes={{ root: classes.dialogContent }}>
              <InputLabel style={{ fontWeight: 'bold', fontFamily: 'monospace, monospace', fontSize: 17 }}> DATA </InputLabel>
              <Input
                multiline
                fullWidth
                disableUnderline
                autoFocus
                type='text'
                name='insertInput'
                inputRef={event => this.insertData = event}
                placeholder="Paste Your Data Here"
                inputProps={{
                 style: { fontSize: 15 , letterSpacing: '0.1em', fontFamily: 'monospace, monospace', overflow: 'auto', minHeight: '45vh', maxHeight: '45vh' }
                }}
                onKeyDown={event => this.handleTabCharacter(event)}
              />
              {(this.props.errorData && this.props.insertError) &&
                <div>
                <span style={{ fontWeight: 'bold', color: 'red', fontSize: 17 , letterSpacing: '0.1em', fontFamily: 'monospace, monospace', marginTop: '10px' }}> Bad Lines Below: </span>
                <Typography style={{ minHeight: '30vh', maxHeight: '30vh', overflow: 'auto' }}>

                  {this.props.errorData.map(err =>
                   <div style={{ fontSize: 15 , letterSpacing: '0.1em', fontFamily: 'monospace, monospace' }}>
                     <pre>
                       {!err.isJSON ? yaml.stringify([err.data], { indent: 2, indentSeq: false, prettyErrors: true }) : JSON.stringify(err.data, null, 4)}
                     </pre>
                     <pre style={{ color: 'red' }}>
                       {yaml.stringify({ 'errors': err.errors }, { indent: 2, indentSeq: true, prettyErrors: true })}
                     </pre>
                   </div>
                  )}
                </Typography>
                </div>}

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

export default BulkView;
