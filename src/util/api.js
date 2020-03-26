import { postToSlack } from './reporter.js';
import md5 from 'md5';
import base64 from 'base-64';

class API {
  static URL (path) {
    return `${process.env.REACT_APP_API_URL || ''}/api/v${process.env.REACT_APP_API_VERSION}${path}`;
  }

  static async endpoint (path, options) {
    let resp;
    let url = API.URL(path);
    console.log(url);

    if (['DELETE', 'PUT'].includes(options.method)) {
      url += `/${options.data.id}`;
      delete options.data.id;
    }

    const opts = {
      method: options.method,
      headers: { Authorization: options.auth || `${localStorage.getItem('token')}` }
    };

    if (['PUT', 'POST'].includes(options.method))
      opts.body = JSON.stringify(options.data);

    try {
      resp = await fetch(url, opts);
    } catch {
      return null;
    }

    if (resp.status !== 200) {
      const message = `ErrorMessage:* ${resp.statusText}\n*ErrorCode:* ${resp.status}`;
      await postToSlack(window.location, message);
      return resp;
    }

    resp.json = await resp.json();
    return resp;
  }

  static async login (username, password) {
    if (password === null || password === '' ||
        username === null || username === '')
      return false;

    password = md5(password);
    const auth = `Basic ${base64.encode(`${username}:${password}`)}`;

    const opts = {
      method: 'GET',
      auth: auth
    };
    const response = await API.endpoint('/auth/login', opts);

    if (response.status === 200) {
      localStorage.setItem('orcaUserAuth', JSON.stringify({
        authenticated: true,
        user: { name: username },
        token: auth
      }));
      return true;
    }
    return false;
  }
}

export default API;
