import React from 'react';
import DataPage from '../../components/DataPage';

class ACLList extends React.Component {
  render() {
    return (
      <div>
        <DataPage
          title='ACL Management'
          loadUrl='/table/acl_view_json'
          crudUrl='/table/access_item'
          parentId='list_id'
          tables={true}
          token={this.props.token}
        />
      </div>
    );
  }
}

export default ACLList;
