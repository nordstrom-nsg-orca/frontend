import React from 'react';
import { withAuth } from '@okta/okta-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReplayTwoToneIcon from '@material-ui/icons/ReplayTwoTone';
import Form from './form.js';
import Table from './table.js';
import style from './style.js';

class DataPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: [],
      displayData: [],
      headers: [],
      formAction: null,
      formOpen: false,
      formData: null,
      error: false,
      load: true
    };

    this.actionButtons = [
      { name: 'PUT', icon: <CreateRoundedIcon style={{ fontSize: '20px' }} /> },
      { name: 'DELETE', icon: <DeleteRoundedIcon style={{ fontSize: '20px' }} /> }
    ];
  }

  async componentDidMount () {
    this.loadData();
  }

  async shouldComponentUpdate (nextProps, nextState) {
    return this.state.data !== nextState.data;
  }

  loadData = async () => {
    try {
      const res = await this.props.loadData();
      const results = res.json[0].results;
      const data = results ? results.data : null;

      if (!data) this.setState({ error: true });
      else {
        this.setState({
          data: data,
          displayData: data,
          headers: results.headers,
          parentheaders: results.parentheaders,
          load: false
        });
      }
    } catch (err) {
      this.setState({ error: true });
    }
  }

  handleFormSubmit = async event => {
    event.preventDefault();
    this.setState({ formOpen: false });

    const target = event.currentTarget;
    const data = {};
    for (let i = 0; i < this.state.headers.length && target.name !== 'DELETE'; i++) {
      const header = this.state.headers[i].column_name;
      const input = target[header];
      const value = (input.type === 'checkbox' ? input.checked : input.value);
      data[header] = value;
    }

    if (target.name === 'POST')
      data[this.props.parentId] = this.state.parentID;
    if (['PUT', 'DELETE'].includes(target.name))
      data.id = parseInt(target.id);

    const options = {
      method: target.name,
      data: data
    };

    try {
      const resp = await this.props.crud(options);
      if (resp.ok)
        this.loadData();
      else
        this.setState({ error: true });
    } catch (err) {
      this.setState({ error: true });
    }
  }

  handleFormClose = () => {
    this.setState({ formOpen: false });
  }

  handleAction = (action, tableId, id, data) => () => {
    this.setState({
      formOpen: true,
      formAction: action,
      formData: data,
      currentID: id,
      parentID: tableId
    });
  }

  handleSearch = (event) => {
    let search = event.target.value;
    search = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    if (search === '') this.setState({ displayData: this.state.data });
    else {
      // start with a copy of the full data
      const searchResults = JSON.parse(JSON.stringify(this.state.data));
      for (let i = this.state.data.length - 1; i >= 0; i--) {
        // loop reverse, so we can splice without offsetting indexes
        for (let j = this.state.data[i].rows.length - 1; j >= 0; j--) {
          let remove = true;
          for (let h = 0; h < this.state.headers.length; h++) {
            const header = this.state.headers[h].column_name;

            if (!(header in this.state.data[i].rows[j])) continue;
            if (this.state.data[i].rows[j][header] === null) continue;

            let value = this.state.data[i].rows[j][header];
            if (typeof value === 'string') {
              value = value.toLowerCase();
              if (value.search(search.toLowerCase()) > -1) remove = false;
            } else continue;
            // if any of the values match the search, don't delete
          }
          if (remove) searchResults[i].rows.splice(j, 1);
        }

        // removes empty lists
        if (searchResults[i].rows.length === 0)
          searchResults.splice(i, 1);
      }

      this.setState({ displayData: searchResults });
    }
  }

  handleUndo = async () => {
    const data = JSON.parse(localStorage.getItem(window.location.pathname));
    if (data.length <= 0) return;
    const lastDeleted = data[0];
    data.splice(0, 1);
    localStorage.setItem(window.location.pathname, JSON.stringify(data));
    delete lastDeleted.id;
    const options = {
      method: 'POST',
      data: lastDeleted
    };
    try {
      const resp = await this.props.crud(options);
      if (resp.ok)
        this.loadData();
      else this.setState({ error: true });
    } catch (err) {
      this.setState({ error: true });
    }
  }

  render () {
    const { classes } = this.props;

    return (
      <div>
        {!this.state.error && (
          <div>
            <Form
              open={this.state.formOpen}
              action={this.state.formAction}
              headers={this.state.headers}
              data={this.state.formData}
              handleFormClose={this.handleFormClose}
              handleFormSubmit={this.handleFormSubmit}
              classes={classes}
            />
            <div style={{ display: 'flex' }}>
              <Typography variant='h4'>
                {this.props.title}
              </Typography>

              <div style={{ marginLeft: 'auto' }}>
                {(this.props.crud && this.props.write) && (
                  <IconButton size='small'>
                    <ReplayTwoToneIcon />
                  </IconButton>
                )}
                <TextField
                  size='small'
                  label='search'
                  variant='outlined'
                  onChange={this.handleSearch}
                />
              </div>
            </div>

            {this.state.load && (
              <div align='center' style={{ paddingTop: '50px' }}>
                <CircularProgress />
              </div>
            )}

            {this.state.displayData.map((table, index) => (
              <Table
                key={index}
                headers={this.state.headers}
                data={table}
                actionButtons={this.actionButtons}
                handleAction={this.props.crud ? this.handleAction : null}
                write={this.props.write}
              />
            ))}
          </div>
        )}

        {this.state.error && (
          <div align='center'>
            <WarningRoundedIcon color='error' fontSize='large' />
            <Typography style={{ fontSize: '1.5em' }}>
              Oops..Something Went Wrong. We are looking into it!
            </Typography>
          </div>
        )}
      </div>

    );
  }
}

DataPage.propTypes = {
  classes: PropTypes.object.isRequired,
  crud: PropTypes.func,
  title: PropTypes.string.isRequired,
  loadData: PropTypes.func.isRequired,
  parentId: PropTypes.string,
  write: PropTypes.bool.isRequired
};

export default withAuth(withStyles(style)(DataPage));
