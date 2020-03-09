import React from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';

class Admin extends React.Component {
  constructor (props) {
    super(props);
    this.state = {

    };
  }

  componentDidUpdate () {
    console.log(this.props);
  }

  render () {
    // const { classes } = this.props;
    // const { auth } = this.props;
    return (
      <div>
        This is an admin
      </div>
    );
  }
}

// Admin.propTypes = {
//   // auth: PropTypes.object.isRequired
// };

export default (Admin);
