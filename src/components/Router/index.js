import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import { withRouter } from 'react-router';
import { SecureRoute } from '@okta/okta-react';
import PropTypes from 'prop-types';

import PageContent from 'components/PageContent';

import Dashboard from 'pages/Dashboard';
import Settings from 'pages/Settings';
import Error from 'pages/Error';
import API from 'util/api.js';
import SchemaDataPage from 'components/SchemaDataPage';

class Router extends React.Component {
  render () {
    const RouterType = this.props.auth.isOrcaUser ? Route : SecureRoute;
    return (
      <div>
        <PageContent>
          <Switch>
            {typeof this.props.schemas !== 'undefined' && this.props.schemas.map((schema, index) => (
              <RouterType
                key={index}
                path={`/schemas/${schema.id}`}
                onLeave={window.onbeforeunload = () => true}
                // TODO pass full schema instead, this will save SchemaDataPage from calling the API for the schema
                render={(props) => <SchemaDataPage id={schema.id} name={schema.name} />}
              />
            ))}

            <RouterType
              exact path='/schemas'
              render={(props) => <SchemaDataPage name='Edit Schemas' />}
            />
            <RouterType
              exact path='/'
              component={Dashboard}
            />
            <RouterType
              path='/settings'
              render={(props) => <Settings {...props} changeSetting={this.props.changeSetting} settings={this.props.settings} />}
            />

            {/* TODO fix slight flash of 404 page  */}
            <RouterType
              render={(props) => <Error {...props} errorType='notFound' />}
            />
          </Switch>
        </PageContent>
      </div>
    );
  }
}

Router.propTypes = {
  auth: PropTypes.object.isRequired,
  changeSetting: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
  // tabs: PropTypes.object.isRequired
};
export default Router;
