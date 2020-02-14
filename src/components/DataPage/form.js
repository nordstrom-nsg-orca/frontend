import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import FormInput from './formInput.js';

class Form extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    const { classes } = this.props;
    return (
      <Dialog open={(this.props.open)} classes={{ paper: classes.dialogPaper }}>
        <DialogContent>
          <Grid
            container
            direction='row'
            justify='center'
            alignItems='center'
            spacing={3}
            style={{ margin: '5px 0px', width: '100%' }}
          >
            {this.props.action !== 'DELETE' && this.props.headers.map((header, index) => (
              <Grid item md={10} key={index}>
                <FormInput
                  handleInput={this.props.handleInput}
                  data={this.props.data}
                  dataType={header.data_type}
                  classes={classes}
                  columnName={header.column_name}
                />
              </Grid>
            ))}
            {this.props.action === 'DELETE' && (
              <Grid item md={12}>
                <DialogContent>
                  <DialogContentText className={classes.dialogInput}>
                    Are you sure you want to delete this?
                  </DialogContentText>
                </DialogContent>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={this.props.handleFormSubmit('cancel')} className={classes.cancel}>
            Cancel
          </Button>
          <Button onClick={this.props.handleFormSubmit(this.props.action)} className={classes.accept}>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
  handleFormSubmit: PropTypes.func,
  action: PropTypes.string,
  headers: PropTypes.array.isRequired,
  data: PropTypes.object,
  open: PropTypes.bool,
  handleInput: PropTypes.func
};

export default Form;
