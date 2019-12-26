import React from 'react';
import DataPage from '../../components/DataPage';

class ACLList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:  [],
      headers: []
    };
  }

  async componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    console.log('LOADDATA');
    const resp = await fetch(`${process.env.REACT_APP_DB_API_URL}/api/acl_view_json`, {
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    })
    const json = await resp.json();
    this.setState({
      data: json[0].results.data,
      headers: json[0].results.headers,
      parentheaders: json[0].results.parentheaders
    });
  }

  update = async (data) => {
    let url = `${process.env.REACT_APP_DB_API_URL}/api/access_item/${data.id}`;
    delete data['id'];
    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.props.token}`
      },
      body: JSON.stringify(data)
    });
    if (resp.ok)
      this.loadData();
  }

  delete = async (data) => {
    let url = `${process.env.REACT_APP_DB_API_URL}/api/access_item/${data.id}`;
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    });
    if (resp.ok)
      this.loadData(); 
  }

  create = async (data, id) => {
    let url = `${process.env.REACT_APP_DB_API_URL}/api/access_item/`;
    data['list_id'] = id;
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    });
    console.log(resp);
    if (resp.ok)
      this.loadData(); 
  }

  updateTable = async (data) => {
    let url = `${process.env.REACT_APP_DB_API_URL}/api/access_list/${data.id}`;
    delete data['id'];
    const resp = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    });
    if (resp.ok)
      this.loadData();
  }

  deleteTable = async (data) => {
    let url = `${process.env.REACT_APP_DB_API_URL}/api/access_list/${data.id}`;
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    });
    if (resp.ok)
      this.loadData(); 
  }

  createTable = async (data) => {
    console.log('hey');
    let url = `${process.env.REACT_APP_DB_API_URL}/api/access_list/`;
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    });
    if (resp.ok)
      this.loadData(); 
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
        <DataPage
          title='ACL Management'
          headers={this.state.headers}
          parentheaders={this.state.parentheaders}
          data={this.state.data}
          tables={true}
          actions={actions}
        />
      </div>

    );
  }

}



export default ACLList;
