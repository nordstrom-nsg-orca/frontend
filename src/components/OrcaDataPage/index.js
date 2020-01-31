import React from 'react';
import { api } from '../../util/api.js'
import DataPage from '../../components/DataPage';


class OrcaDataPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };

  }

  async componentDidMount() { }

  loadData = async () => {
    return await api(this.props.loadUrl, {method: 'GET', token: this.props.token});
  }

  crud = async (options) => {
    return await api(this.props.crudUrl, options)
  }

  render() {
    return(
      <DataPage
        title={this.props.title}
        loadData={this.loadData}
        crud={this.crud}
        parentId={this.props.parentId}
      />
    )
  }

}


export default (OrcaDataPage);
