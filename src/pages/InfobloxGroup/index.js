import React from 'react';
import DataPage from '../../components/DataPage';
import PropTypes from 'prop-types';
import { getGroupsPermission } from '../../util/infoblox.js';

class InfobloxGroup extends React.Component {
  loadData = async () => {
    return getGroupsPermission();
  }

  render () {
    return (
      <div>
        <DataPage
          title='Group Permission'
          loadData={this.loadData}
        />
      </div>
    );
  }
}

// InfobloxGroup.propTypes = {
//   token: PropTypes.string.isRequired
// };
export default InfobloxGroup;
