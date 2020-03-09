import React from 'react';
import API from 'util/api.js';
import DataPage from 'components/DataPage';
import PropTypes from 'prop-types';

class OrcaDataPage extends React.Component {
  loadData = async () => {
    return API.endpoint(this.props.loadUrl, { method: 'GET' });
  }

  crud = async (options) => {
    return API.endpoint(this.props.crudUrl, options);
  }

  render () {
    return (
      <DataPage
        title={this.props.title}
        loadData={this.loadData}
        crud={this.crud}
        parentId={this.props.parentId}
        write={this.props.write}
      />
    );
  }
}

OrcaDataPage.propTypes = {
  title: PropTypes.string.isRequired,
  loadUrl: PropTypes.string.isRequired,
  crudUrl: PropTypes.string.isRequired,
  parentId: PropTypes.string.isRequired,
  write: PropTypes.bool.isRequired
};

export default OrcaDataPage;
