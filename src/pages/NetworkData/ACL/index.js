import React from 'react';
import OrcaDataPage from 'components/OrcaDataPage';

class ACLList extends React.Component {
 render () {
    return (
      <div>
        <OrcaDataPage
          title='ACL Management'
          loadUrl='/table/acl_view_json'
          crudUrl='/table/access_item'
          parentId='list_id'
        />
      </div>
    );
  }
}
export default ACLList;
