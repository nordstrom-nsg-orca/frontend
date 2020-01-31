import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import InputBase from '@material-ui/core/InputBase';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import Typography from '@material-ui/core/Typography';
import Form from './form.js';
import Table from './table.js';
import style from "./style.js";

class DataPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data:  [],
      displayData: [],
      headers: [],
      formAction: null,
      formOpen: false,
      formHeaders: [],
      formData: null,
    };

    this.actionButtons = [
      {name: 'PUT', icon: <CreateRoundedIcon style={{fontSize: '20px'}} />},
      {name: 'DELETE', icon: <DeleteRoundedIcon style={{fontSize: '20px'}} />},
    ];
  }

  async componentDidMount() { this.loadData() }
  async shouldComponentUpdate(nextProps, nextState) {
   return this.state.data !== nextState.data;
  }

  loadData = async () => {

    try {
      const res = await this.props.loadData();
      // console.log(res.json[0]);
      this.setState({
        data: res.json[0].results.data || null,
        displayData: res.json[0].results.data || null,
        headers: res.json[0].results.headers,
        parentheaders: res.json[0].results.parentheaders
      });
    } catch (err) {
      console.log(err);
    }

  }

  // handleCreate = (tableName) => {
  //   this.setState({formOpen: true, parentID: tableName});
  // }

  handleFormSubmit = async (action) => {
    this.setState({ formOpen: false });
    if (action === 'cancel') return;
    console.log(this.state.formData);
    let options = {
      method: action,
      token: this.props.token,
      data: this.state.formData
    }
    if (action === 'POST' && this.props.parentId)
      options.data[this.props.parentId] = this.state.parentID;
    try {
      const resp = await this.props.crud(options);
      if (resp.ok)
        this.loadData();
    } catch (err) {
      console.log(err);
    }


  }

  handleAction = (action, tableId, id, data) => {
    if (action === 'POST') {
      data = {};
      for (let i in this.props.headers)
        data[this.props.headers[i]] = '';
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

  handleInput = (header, event) => {
    var data;
    if (this.state.isAdd && this.state.formData === null) {
      data = {};
    } else {
      data = JSON.parse(JSON.stringify(this.state.formData));
    }
    data[header] = event.target.value;
    this.setState({formData: data, isInput: true});
  }


  handleSearch = (event) => {
    let search = event.target.value;
    search = search.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    if (search === '') {
      this.setState({ displayData: this.state.data });
    } else {

      // start with a copy of the full data
      let searchResults = JSON.parse(JSON.stringify(this.state.data));

      for (let i = this.state.data.length - 1; i >= 0; i--) {

        // loop reverse, so we can splice without offsetting indexes
        for (let j = this.state.data[i]['rows'].length - 1; j >= 0; j--) {

          let remove = true;
          for (let h = 0; h < this.state.headers.length; h++) {
            const header = this.state.headers[h];
            const value = this.state.data[i]['rows'][j][header].toLowerCase();

            // if any of the values match the search, don't delete
            if (value.search(search.toLowerCase()) > -1) remove = false;
          }
          if (remove) searchResults[i]['rows'].splice(j,1);
        }

        // removes empty lists
        if (searchResults[i]['rows'].length === 0)
          searchResults.splice(i,1);
      }

      this.setState({ displayData: searchResults });
    }
  }



  render() {
    const { classes } = this.props;


    return (
      <div className={classes.root}>

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

        <div style ={{display: 'flex'}}>
          <Typography variant="h4">{this.props.title}</Typography>

          <div style={{marginLeft: 'auto'}}>

            <SearchRoundedIcon className={classes.searchIcon} />
            <InputBase
              placeholder="Search"
              className={classes.searchInput}
              onChange = {this.handleSearch}
            />
          </div>
        </div>

        { this.state.displayData.map((table, index) =>
          <Table
            key={index}
            deleteTable={this.deleteTable}
            headers={this.state.headers}
            data={table}
            actionButtons={this.actionButtons}
            handleAction={this.props.crud ? this.handleAction: null}
            classes={classes}
          />
        )}
      </div>
    );
  }
}


export default withStyles(style)(DataPage);
