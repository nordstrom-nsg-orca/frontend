import React from 'react';
import { api } from '../../util/api.js';
import DataPage from '../../components/DataPage';
import PropTypes from 'prop-types';

class OrcaDataPage extends React.Component {
  loadData = async () => {
    return api(this.props.loadUrl, { method: 'GET', token: this.props.token });
  }

  crud = async (options) => {
    return api(this.props.crudUrl, options);
  }

  render () {
    return (
      <DataPage
        title={this.props.title}
        loadData={this.loadData}
        crud={this.crud}
        parentId={this.props.parentId}
      />
    );
  }
}

OrcaDataPage.propTypes = {
  title: PropTypes.string.isRequired,
  loadUrl: PropTypes.string.isRequired,
  crudUrl: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  parentId: PropTypes.string.isRequired
};

export default OrcaDataPage;
