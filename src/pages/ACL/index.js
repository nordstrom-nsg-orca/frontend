import React from 'react';
import DataPage from '../../components/DataPage';

class ACLList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:  [],
      headers: [],
      error: false,
    };
  }

  async componentDidMount() {
    this.loadData()
  }

  loadData = async () => {
    console.log('LOADDATA');
    try {
        const resp = await fetch(`${process.env.REACT_APP_DB_API_URL}/api/acl_view_json`, {
        headers: {
          'x-api-key': `${this.props.apiKey}`
        }
      });
      const json = await resp.json();
      if (resp.status !== 200) {
        console.log(json.msg);
        this.setState({error: true});
      } else {
        this.setState({
          data: json[0].results.data,
          headers: json[0].results.headers,
          parentheaders: json[0].results.parentheaders
        });
      }
    } catch (err) {

      // const resp = await fetch("https://hooks.slack.com/services/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", {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     "text": "Hello World! Testing"
      //   })
      // });
      // console.log(resp);
      // console.log(err);
      if (err) this.setState({error: true});
    }

  }

  update = async (data) => {
    try {
      let url = `${process.env.REACT_APP_DB_API_URL}/api/access_item/${data.id}`;
      delete data['id'];
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-api-key': `${this.props.apiKey}`
        },
        body: JSON.stringify(data)
      });
      if (resp.ok)
        this.loadData();
    } catch (err) {
      if (err) this.setState({error: true});
    }

  }

  delete = async (data) => {
    try {
      let url = `${process.env.REACT_APP_DB_API_URL}/api/access_item/${data.id}`;
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
          'x-api-key': `${this.props.apiKey}`
        }
      });
      if (resp.ok)
        this.loadData();
    } catch(err) {
      if(err) this.setState({error: true});
    }

  }

  create = async (data, id) => {
    try {
      let url = `${process.env.REACT_APP_DB_API_URL}/api/access_item/`;
      data['list_id'] = id;
      const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'x-api-key': `${this.props.apiKey}`
        }
      });
      console.log(resp);
      if (resp.ok)
        this.loadData();
    } catch(err) {
      if(err) this.setState({error: true});
    }
  }

  updateTable = async (data) => {
    try {
      let url = `${process.env.REACT_APP_DB_API_URL}/api/access_list/${data.id}`;
      delete data['id'];
      const resp = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'x-api-key': `${this.props.apiKey}`
        }
      });
      if (resp.ok)
        this.loadData();
    } catch(err) {
      if(err) this.setState({error: true});
    }
  }

  deleteTable = async (data) => {
    try {
      let url = `${process.env.REACT_APP_DB_API_URL}/api/access_list/${data.id}`;
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
          'x-api-key': `${this.props.apiKey}`
        }
      });
      if (resp.ok)
        this.loadData();
    } catch(err) {
      if(err) this.setState({error: true});
    }
  }

  createTable = async (data) => {
    try {
      let url = `${process.env.REACT_APP_DB_API_URL}/api/access_list/`;
      const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'x-api-key': `${this.props.apiKey}`
        }
      });
      if (resp.ok)
        this.loadData();
    } catch(err) {
      if(err) this.setState({error: true});
    }
  }



  render() {

    const actions = {
      'create': this.create,
      'update': this.update,
      'delete': this.delete,
      'createTable': this.createTable,
      'deleteTable': this.deleteTable,
      'updateTable': this.updateTable,
    };

    return (
      <div>
        {!this.state.error &&
          <DataPage
            title='ACL Management'
            headers={this.state.headers}
            parentheaders={this.state.parentheaders}
            data={this.state.data}
            tables={true}
            actions={actions}
          />
        }
        { this.state.error &&
          <div align = 'center' style={{fontSize: '1.5em'}}>

            Sorry, something went wrong. We are looking into it.

          </div>
        }
      </div>

    );
  }

}



export default ACLList;
