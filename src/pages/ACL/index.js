import React from 'react';
import DataPage from '../../components/DataPage';
import { postToSlack } from '../../util/reporter.js'
import ReportProblemRoundedIcon from '@material-ui/icons/ReportProblemRounded';

class ACLList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:  [],
      displayData: [],
      headers: [],
      error: false,
    };
  }

  async componentDidMount() { this.loadData() }

  loadData = async () => {
    console.log('LOADDATA');
    try {
        const resp = await fetch(`${process.env.REACT_APP_DB_API_URL}/table/acl_view_json`, {
        headers: {
          'x-api-key': `${this.props.apiKey}`
        }
      });
      const json = await resp.json();
      if (resp.status !== 200) {
        const message = `ErrorMessage:* ${resp.statusText}\n*ErrorCode:* ${resp.status}`;
        await postToSlack(window.location, message);
        this.setState({ error: true });
      } else {
        this.setState({
          data: json[0].results.data === null ? []: json[0].results.data,
          displayData: json[0].results.data,
          headers: json[0].results.headers,
          parentheaders: json[0].results.parentheaders
        });
      }
    } catch (err) {
      const message = `ErrorMessage:* ${err}\n*Function:* loadData()`
      await postToSlack(window.location, message);
      this.setState({ error: true });
    }
  }

  handleSearch = (event) => {
    const search = event.target.value;
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

  update = async (data) => {
    try {
      let url = `${process.env.REACT_APP_DB_API_URL}/table/access_item/${data.id}`;
      delete data['id'];
      const resp = await fetch(url, {
        method: 'PUT',
        headers: { 'x-api-key': `${this.props.apiKey}` },
        body: JSON.stringify(data)
      });
      if (resp.ok)
        this.loadData();
    } catch (err) { this.setState({error: true}); }
  }

  delete = async (data) => {
    try {
      let url = `${process.env.REACT_APP_DB_API_URL}/table/access_item/${data.id}`;
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: { 'x-api-key': `${this.props.apiKey}` }
      });
      if (resp.ok)
        this.loadData();
    } catch(err) {
      this.setState({error: true});
    }
  }

  create = async (data, id) => {
    try {
      let url = `${process.env.REACT_APP_DB_API_URL}/table/access_item/`;
      data['list_id'] = id;
      const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'x-api-key': `${this.props.apiKey}` }
      });
      if (resp.ok) {
        this.loadData();
      } else {
        const message = `ErrorMessage:* ${resp.statusText}\n*ErrorCode:* ${resp.status}\n*Function:* create()`;
        await postToSlack(window.location, message);
        this.setState({ error: true })
      }
    } catch(err) {
      const message = `ErrorMessage:* ${err}\n*ErrorCode:* 403\n*Function:* create()`;
      await postToSlack(window.location, message);
      this.setState({ error: true });
    }
  }

  render() {

    const actions = {
      'create': this.create,
      'update': this.update,
      'delete': this.delete
    };

    return (
      <div>
        {!this.state.error &&
          <DataPage
            title='ACL Management'
            headers={this.state.headers}
            parentheaders={this.state.parentheaders}
            handleSearch={this.handleSearch}
            data={this.state.displayData}
            tables={true}
            actions={actions}
          />
        }
        { this.state.error &&
          <div align ='center' style={{fontSize: '1.5em' }}>
            <div >
              <ReportProblemRoundedIcon color='secondary' fontSize='large' />
            </div>
            <div >
              Sorry, something went wrong. We are looking into it.
            </div>
          </div>
        }
      </div>

    );
  }

}

export default ACLList;
