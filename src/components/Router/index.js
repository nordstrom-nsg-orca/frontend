import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import PropTypes from 'prop-types';

import PageContent from 'components/PageContent';

import Dashboard from 'pages/Dashboard';
import Settings from 'pages/Settings';
import Error from 'pages/Error';

class Router extends React.Component {
  render () {
    const RouterType = this.props.auth.isOrcaUser ? Route : SecureRoute;
    return (
      <div>
        <PageContent>
          <Switch>
            {Object.entries(this.props.tabs).map(([key, tab], index) => (
              Object.entries(tab.pages).map(([pkey, page], pindex) => (
                page.allowed ? (
                  <RouterType
                    key={pindex}
                    path={`/${key}/${pkey}`}
                    component={page.component}
                  />
                ) : (
                  <RouterType
                    key={pindex}
                    path={`/${key}/${pkey}`}
                    render={(props) => <Error {...props} errorType='noAccess' />}
                  />
                )
              ))
            ))}

            <RouterType
              exact path='/'
              component={Dashboard}
            />
            <RouterType
              path='/settings'
              render={(props) => <Settings {...props} changeSetting={this.props.changeSetting} settings={this.props.settings} />}
            />
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
  settings: PropTypes.object.isRequired,
  tabs: PropTypes.object.isRequired
};
export default Router;
