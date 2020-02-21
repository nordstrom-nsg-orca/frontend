import React from 'react';
import { Route } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import PropTypes from 'prop-types';
import PageContent from 'components/PageContent';
import Dashboard from 'pages/Dashboard';
import Settings from 'pages/Settings';
import tabs from 'util/pages.js';

class Router extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    const RouterType = this.props.auth.isOktaUser ? Route : SecureRoute;
    return (
      <div>
        <PageContent>
          <Route path='/' exact component={Dashboard} />
          {tabs.map((tab, index) => (
            tab.pages.map((page, pindex) => (
              <RouterType
                key={pindex}
                exact path={tab.url + page.url}
                component={page.component}
              />
            ))
          ))}
          <RouterType
            exact path='/dashboard'
            component={Dashboard}
          />
          <RouterType
            path='/settings'
            render={(props) => <Settings {...props} changeTheme={this.props.changeTheme} light={this.props.light} />}
          />
        </PageContent>
      </div>
    );
  }
}

Router.propTypes = {
  auth: PropTypes.object.isRequired,
  changeTheme: PropTypes.func.isRequired,
  light: PropTypes.bool.isRequired
};
export default Router;
