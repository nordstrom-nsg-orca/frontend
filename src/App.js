import React from 'react';
import { Route } from 'react-router-dom';
import { ImplicitCallback, SecureRoute, withAuth } from '@okta/okta-react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ACL from './pages/ACL';
import Secret from './pages/Secret';
import APIDoc from './pages/APIDoc';



import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.state = {
      auth: {
        user: null,
        authenticated: false,
      },
      isAPIDocPath: false,
    };
  }

  async componentDidMount() {
    console.log('mount  ' + this.state.auth.authenticated); this.checkAuthentication();
    if (window.location.href === window.location.origin + '/api/doc') {
      this.setState({isAPIDocPath: true});
    } else this.setState({isAPIDocPath: false});
  }
  async componentDidUpdate() {
    if (!this.state.auth.authenticated) {
      this.checkAuthentication();
    }

  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated && !this.state.auth.user) {
      const userinfo = await this.props.auth.getUser();
      const token = await this.props.auth.getAccessToken();
      console.log('Retrieving api key...');
      try {
        const resp = await fetch(`${process.env.REACT_APP_DB_API_URL}/api/retrieveKey`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        const json = await resp.json();
        this.setState({
          auth: {
            authenticated: authenticated,
            user: userinfo,
            token: token,
            apiKey: json.apiKey
          }
        });
      } catch(err) {
        console.log(err);
      }

    }
  }


  login() {
    if (!this.state.authenticated){
      this.props.auth.login('/dashboard');
    }
  }

  async logout() {
    await this.props.auth.logout('/');
    this.setState({
      auth: {
        authenticated: false,
        user: null,
        token: null
      }
    });
  }

  render() {
    return (
      <div>
        { (this.state.isAPIDocPath) &&
          <Route path='/api/doc' component={APIDoc}/>
        }
        { !this.state.isAPIDocPath  &&
          <div>
        	<Navbar auth={this.state.auth} logout={this.logout} login={this.login}>
            {!this.state.auth.authenticated && <Route path='/' exact={true} component={Home} />}
            {this.state.auth.authenticated &&
              <div>
                <Route path='/' exact={true} component={Dashboard} />
                <SecureRoute path='/acl' render={(props) => <ACL {...props} apiKey={this.state.auth.apiKey} />} />
                <SecureRoute path='/dashboard' exact={true} component={Dashboard} />
                <SecureRoute path='/secret' component={Secret} />

              </div>
            }
            <Route path='/implicit/callback' component={ImplicitCallback} />
          </Navbar>
          </div>
        }

      </div>

    );
  }
}

export default withAuth(App);
