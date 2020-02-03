import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import swagger from './swagger.json';
class APIDoc extends React.Component {
  constructor (props) {
    super(props);
    this.state = {

    };
  }

  render () {
    return (
      <div>
        <SwaggerUI spec={swagger} />
      </div>
    );
  }
}

export default APIDoc;
