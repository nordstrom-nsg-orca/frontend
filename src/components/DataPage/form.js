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
      <Dialog open={(this.props.open)} className={classes.dialog}>
        <DialogContent>
          
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
              <FormControl>
                <InputLabel>{header}</InputLabel>
                <Input onChange={event => this.props.handleInput(header, event)}
                    value={this.props.data? this.props.data[header] : ''}/>
              </FormControl>
            </Grid>
          )}

          {this.props.action === 'delete' &&
            <Grid item md={12}>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this?
                </DialogContentText>
              </DialogContent>
            </Grid>
          }

          </Grid>
        </DialogContent>

        <DialogActions >
          <Button onClick={this.props.handleFormExit.bind(this, 'cancel')} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.handleFormExit.bind(this,this.props.action)} color="primary">
              {this.props.action}
          </Button>
        </DialogActions>

      </Dialog>
    );
  }

}
const style = theme => ({
 dialog: {
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
 }
});

export default withStyles(style)(Form);
