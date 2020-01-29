import React from 'react';
import DataPage from '../../components/DataPage';

class ServerList extends React.Component {
  render() {
    return (
      <div>
        <DataPage
          title='Server Management'
          loadUrl='/table/server_view_json'
          crudUrl='/table/server_item'
          parentId='type_id'
          tables={true}
          token={this.props.token}
        />
      </div>
    );
  }
}

export default ServerList;
