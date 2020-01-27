import React from 'react';
import { Route } from 'react-router-dom';
import { ImplicitCallback, SecureRoute, withAuth } from '@okta/okta-react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ACL from './pages/ACL';
import Secret from './pages/Secret';
import APIDoc from './pages/APIDoc';
import Settings from './pages/Settings';
import {lightTheme, darkTheme} from './global.js';

import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      auth: {
        user: null,
        authenticated: false,
      },
      light: true,
    };
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
  }

   async componentDidMount() {
    console.log('mount  ' + this.state.auth.authenticated); this.checkAuthentication();
  }
   async componentDidUpdate() {
    if (!this.state.auth.authenticated) {
      this.checkAuthentication();
    }
  }

  changeTheme(event, label) {
    if (label === 'light' && !this.state.light) {
      this.setState({light: event.target.checked, dark: !event.target.checked});
    } else this.setState({dark: event.target.checked, light: !event.target.checked});

  }


  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated && !this.state.auth.user) {
      const userinfo = await this.props.auth.getUser();
      const token = await this.props.auth.getAccessToken();
      console.log('Retrieving api key...');
      try {
        const resp = await fetch(`${process.env.REACT_APP_DB_API_URL}/token`, {
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
    let theme;
    if (this.state.light) {
      theme = lightTheme;
    } else theme = darkTheme;
    const main = {
      width: '100%',
      minHeight: '100vh',
      margin: '0 auto',
      padding: '0',
      background: theme.bodyBackground,
      color: theme.color
    };
    return (
      <div>
          <Route path='/api/doc' component={APIDoc}/>
         { window.location.pathname !== '/api/doc' &&
            <div style={main}>
              <ThemeProvider theme={{...createMuiTheme(), ...theme}}>
              	<Navbar auth={this.state.auth} logout={this.logout} login={this.login}>
                  {!this.state.auth.authenticated && <Route path='/' exact={true} component={Home} />}
                  {this.state.auth.authenticated &&
                    <div>
                      <Route path='/' exact={true} component={Dashboard} />
                      <SecureRoute path='/acl' render={(props) => <ACL {...props} apiKey={this.state.auth.apiKey} />} />
                      <SecureRoute path='/dashboard' exact={true} component={Dashboard} />
                      <SecureRoute path='/secret' component={Secret} />
                      <SecureRoute path='/settings' render={(props) => <Settings {...props} changeTheme={this.changeTheme} light={this.state.light} />}  />
                    </div>
                  }
                  <Route path='/implicit/callback' component={ImplicitCallback} />
                </Navbar>
              </ThemeProvider>
            </div>
          }

      </div>

    );
  }
}

export default withAuth(App);
