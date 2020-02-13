import React from 'react';
import OrcaDataPage from 'components/OrcaDataPage';
import PropTypes from 'prop-types';

class ServerList extends React.Component {
  render () {
    return (
      <div>
        <OrcaDataPage
          title='Server Management'
          loadUrl='/table/server_view_json'
          crudUrl='/table/server_item'
          parentId='type_id'
          token={this.props.token}
        />
      </div>
    );
  }
}
ServerList.propTypes = {
  token: PropTypes.string.isRequired
};
export default ServerList;
