import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import DialogContentText from '@material-ui/core/DialogContentText';


class Form extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

  }



  render() {
    const { classes } = this.props;

    return (
      <Dialog open={(this.props.open)} >
        <DialogContent className={classes.dialog}>

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={5}
            style={{marginBottom: '10px'}}
          >

          {this.props.action !== 'delete' && this.props.headers.map((header, index) =>
            <Grid item md={6} key={index}>
              <FormControl >
                <InputLabel className={classes.formStyle} focused={false} variant='filled'>{header}</InputLabel>
                <Input onChange={event => this.props.handleInput(header, event)}
                    value={this.props.data? this.props.data[header] : ''} className={classes.formStyle} />
              </FormControl>
            </Grid>
          )}

          {this.props.action === 'delete' &&
            <Grid item md={12}>
              <DialogContent>
                <DialogContentText className={classes.formStyle}>
                  Are you sure you want to delete this?
                </DialogContentText>
              </DialogContent>
            </Grid>
          }

          </Grid>
        </DialogContent>

        <DialogActions className={classes.dialog}>
          <Button onClick={this.props.handleFormExit.bind(this, 'cancel')} className={classes.formStyle}>
            Cancel
          </Button>
          <Button onClick={this.props.handleFormExit.bind(this,this.props.action)} className={classes.formStyle}>
              {this.props.action}
          </Button>
        </DialogActions>

      </Dialog>
    );
  }

}

export default Form;
