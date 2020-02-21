import React from 'react';
import { withAuth } from '@okta/okta-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import InputBase from '@material-ui/core/InputBase';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import Typography from '@material-ui/core/Typography';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import CircularProgress from '@material-ui/core/CircularProgress';

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
      formHeaders: [],
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
          error: false,
          load: false
        });
      }
    } catch (err) {
      this.setState({ error: true });
    }
  }

  handleFormSubmit = (action) => async () => {
    this.setState({ formOpen: false });
    if (action === 'cancel')
      return;

    const options = {
      method: action,
      data: this.state.formData
    };

    if (action === 'POST' && this.props.parentId)
      options.data[this.props.parentId] = this.state.parentID;
    try {
      const resp = await this.props.crud(options);
      if (resp.ok)
        this.loadData();
      else this.setState({ error: true });
    } catch (err) {
      this.setState({ error: true });
    }
  }

  handleAction = (action, tableId, id, data) => () => {
    if (action === 'POST') {
      data = {};
      for (const i in this.state.headers)
        data[this.state.headers[i]] = '';
    }
    this.setState({
      formOpen: true,
      formAction: action,
      formHeaders: this.state.headers,
      formData: data,
      currentID: id,
      parentID: tableId
    });
  }

  handleInput = (header, value) => {
    var data;
    if (this.state.isAdd && this.state.formData === null) data = {};
    else data = JSON.parse(JSON.stringify(this.state.formData));

    data[header] = value;
    this.setState({ formData: data, isInput: true });
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

  render () {
    const { classes } = this.props;

    return (
      <div>
        {!this.state.error && (
          <div>
            <Form
              open={this.state.formOpen}
              action={this.state.formAction}
              title={this.props.title}
              headers={this.state.formHeaders}
              data={this.state.formData}
              handleInput={this.handleInput}
              handleFormSubmit={this.handleFormSubmit}
              classes={classes}
            />
            <div style={{ display: 'flex' }}>
              <Typography variant='h4'>
                {this.props.title}
              </Typography>

              <div style={{ marginLeft: 'auto' }}>
                <SearchRoundedIcon className={classes.searchIcon} />
                <InputBase
                  placeholder='Search'
                  className={classes.searchInput}
                  onChange={this.handleSearch}
                />
              </div>
            </div>

            {this.state.load && (
              <div align='center' style={{ paddingTop: '50px' }}>
                <CircularProgress classes={{ colorPrimary: classes.loadIcon }} />
              </div>
            )}

            {this.state.displayData.map((table, index) => (
              <Table
                key={index}
                deleteTable={this.deleteTable}
                headers={this.state.headers}
                data={table}
                actionButtons={this.actionButtons}
                handleAction={this.props.crud ? this.handleAction : null}
                classes={classes}
              />
            ))}
          </div>
        )}

        {this.state.error && (
          <div align='center'>
            <div>
              <WarningRoundedIcon className={classes.errorIcon} />
            </div>
            <div className={classes.errorMessage}>
              Opps..Something Went Wrong. We are looking into it!
            </div>
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
  parentId: PropTypes.string
};

export default withAuth(withStyles(style)(DataPage));
