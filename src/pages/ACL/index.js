import React from 'react';
import OrcaDataPage from '../../components/OrcaDataPage';
import PropTypes from 'prop-types';

class ACLList extends React.Component {
  render () {
    return (
      <div>
        <OrcaDataPage
          title='ACL Management'
          loadUrl='/table/acl_view_json_test'
          crudUrl='/table/access_item'
          parentId='list_id'
          token={this.props.token}
        />
      </div>
    );
  }
}

ACLList.propTypes = {
  token: PropTypes.string.isRequired
};
export default ACLList;
