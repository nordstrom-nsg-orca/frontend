import React from 'react';
import { withStyles } from '@material-ui/core/styles';

class ContentPage extends React.Component {
  render() {
    const { classes } = this.props;
    return(<div className={classes.content}>{this.props.children}</div>)
  }
}

const style = theme => ({
  content: {
    width: theme.maxWidth,
    margin: '0 auto',
    color: theme.color
  }
});

export default withStyles(style)(ContentPage);
