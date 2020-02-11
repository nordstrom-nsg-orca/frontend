import React from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';

class FormInput extends React.Component {

  render () {
    const { classes } = this.props;

    let input = '';
    if (this.props.dataType === 'boolean') {
      input = (
        <Checkbox
          checked={this.props.data[this.props.columnName]}
          onChange={event => this.props.onHandleInput(this.props.columnName, event.target.checked)}
          className={classes.checkBox}
          color='inherit'
        />);
    } else {
      input = (
        <Input
          onChange={event => this.props.onHandleInput(this.props.columnName, event.target.value)}
          classes={{ underline: classes.dialogUnderline, root: classes.dialogInput, focused: classes.inputFocused }}
          value={this.props.data ? this.props.data[this.props.columnName] : ''}
        />);
    }

    return (
      <div>
        <InputLabel
          className={classes.inputLabel}
          classes={{ focused: classes.inputFocused, root: classes.inputLabel }}
        >
          {this.props.columnName}
        </InputLabel>
        {input}
      </div>
    );
  }
}
FormInput.propTypes = {
  dataType: PropTypes.object.isRequired,
  columnName: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onHandleInput: PropTypes.func
};

export default FormInput;
