import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';

class FormInput extends React.Component {
  render () {
    let input = '';
    if (this.props.dataType === 'boolean') {
      input = (
        <Checkbox
          color='primary'
          checked={this.props.data[this.props.columnName]}
          onChange={event => this.props.handleInput(this.props.columnName, event.target.checked)}
        />);
    } else {
      input = (
        <TextField
          size='small'
          onChange={event => this.props.handleInput(this.props.columnName, event.target.value)}
          type='text'
          variant='outlined'
          style={{ width: '100%' }}
          value={this.props.data ? this.props.data[this.props.columnName] : ''}
        />);
    }

    return (
      <div>
        <InputLabel>
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
  handleInput: PropTypes.func
};

export default FormInput;
