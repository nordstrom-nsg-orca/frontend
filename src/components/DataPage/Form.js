import React from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';


class Form extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }



  render() {
    return (
      <Dialog open={this.props.isAdd || this.props.isEdit} aria-labelledby="form-dialog-title" className = {this.props.classes.dialog} >
        <DialogContent>
          <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing = {5}
            style = {{marginBottom: '10px'}}
          >
          {this.props.isAdd &&
             this.props.headers.map(form => {
              if (form.label === 'Actions') {
                return (<div></div>);
              }
              const gridSpace = 12 / this.props.headers.length;
              return (
                <Grid item md = {6} >
                  <FormControl>
                    <InputLabel htmlFor="my-input"> {form.label} </InputLabel>
                    <Input id={form.label} aria-describedby="my-helper-text" onChange = {event => this.props.handleInput(form.index, event)}/>
                  </FormControl>
                </Grid>
              );
            })
          }

          {this.props.isEdit &&
             this.props.headers.map(form => {
               if (form.label === 'Actions') {
                 return (<div></div>);
               }
               const gridSpace = 12 / this.props.headers.length;
              return (
                <Grid item md = {6} >
                  <FormControl>
                    <InputLabel htmlFor="my-input"> {form.label} </InputLabel>
                    <Input id={form.label} aria-describedby="my-helper-text" onChange = {event => this.props.handleInput(form.index, event)}
                        value = {this.props.currentData[form.index]}/>
                  </FormControl>
                </Grid>
              );
            })
          }

          </Grid>
        </DialogContent>

        <DialogActions >
          <Button onClick={this.props.handleDialogExit} color="primary">
            Cancel
          </Button>
          { this.props.isAdd &&
            <Button onClick={() => this.props.handleDialogExit()} color="primary">
              Save
            </Button>
          }
          { this.props.isEdit &&
            <Button onClick={() => this.props.handleDialogExit()} color="primary">
              Update
            </Button>
          }
        </DialogActions>

      </Dialog>
    );
  }

}

export default Form;
