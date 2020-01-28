import { postToSlack } from './reporter.js'

export async function api(path, options) {
  
  let url = `${process.env.REACT_APP_DB_API_URL}${path}`;  
  if (['DELETE', 'PUT'].includes(options.method)) {
    url += `/${options.data['id']}`;
    delete options.data.id;
  }
  
  let opts = {
    method: options.method,
    headers: { 'x-api-key': options.token }
  }

  if (['PUT','POST'].includes(options.method))
    opts.body = JSON.stringify(options.data);
  
  const resp = await fetch(url, opts);

  if (resp.status !== 200) {
    const message = `ErrorMessage:* ${resp.statusText}\n*ErrorCode:* ${resp.status}`;
    await postToSlack(window.location, message);
  }

  resp.json = await resp.json();
  return resp;
}


export async function tokenExchange(oAuthToken) {
  const url = `${process.env.REACT_APP_DB_API_URL}/token`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${oAuthToken}` } });
  const json = await resp.json();
  return json.apiKey;
}