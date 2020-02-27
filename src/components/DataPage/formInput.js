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
          name={this.props.columnName}
          defaultChecked={this.props.data[this.props.columnName]}
          value={this.props.data[this.props.columnName]}
        />
      );
    } else {
      input = (
        <TextField
          size='small'
          name={this.props.columnName}
          type='text'
          variant='outlined'
          style={{ width: '100%' }}
          defaultValue={this.props.data[this.props.columnName] || ''}
        />
      );
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
  dataType: PropTypes.string.isRequired,
  columnName: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default FormInput;
