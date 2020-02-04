import React from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import DialogContentText from '@material-ui/core/DialogContentText';
import PropTypes from 'prop-types';

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
            spacing={5}
            style={{ marginBottom: '10px' }}
          >

            {this.props.action !== 'DELETE' && this.props.headers.map((header, index) =>
              <Grid item md={6} key={index}>
                <FormControl>
                  <InputLabel
                    className={classes.inputLabel}
                    classes={{ focused: classes.inputFocused, root: classes.inputLabel }}
                  >
                    {header}
                  </InputLabel>
                  <Input
                    onChange={event => this.props.onHandleInput(header, event)}
                    classes={{ underline: classes.dialogUnderline, root: classes.dialogInput, focused: classes.inputFocused }}
                    value={this.props.data ? this.props.data[header] : ''}
                  />
                </FormControl>
              </Grid>)}
            {this.props.action === 'DELETE' &&
              <Grid item md={12}>
                <DialogContent>
                  <DialogContentText className={classes.dialogInput}>
                    Are you sure you want to delete this?
                  </DialogContentText>
                </DialogContent>
              </Grid>}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={this.props.onHandleFormSubmit('cancel')} color='primary'>
            Cancel
          </Button>
          <Button onClick={this.props.onHandleFormSubmit(this.props.action)} color='primary'>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
Form.propTypes = {
  classes: PropTypes.object.isRequired,
  onHandleFormSubmit: PropTypes.func,
  action: PropTypes.string,
  headers: PropTypes.array.isRequired,
  data: PropTypes.object,
  open: PropTypes.bool,
  onHandleInput: PropTypes.func
};

export default Form;
