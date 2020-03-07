import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

class ContentPage extends React.Component {
  render () {
    const { classes } = this.props;
    return (<div className={classes.content}>{this.props.children}</div>);
  }
}

const style = theme => ({
  content: {
    maxWidth: '900px',
    margin: '0 auto'
  }
});

ContentPage.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired
};
export default withStyles(style)(ContentPage);
