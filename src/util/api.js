import { postToSlack } from './reporter.js';

export async function api (path, options) {
  let url = `${process.env.REACT_APP_DB_API_URL}${path}`;
  if (['DELETE', 'PUT'].includes(options.method)) {
    url += `/${options.data.id}`;
    delete options.data.id;
  }

  const opts = {
    method: options.method,
    headers: { Authorization: `${localStorage.getItem('token')}` }
  };

  if (['PUT', 'POST'].includes(options.method))
    opts.body = JSON.stringify(options.data);

  const resp = await fetch(url, opts);

  if (resp.status !== 200) {
    const message = `ErrorMessage:* ${resp.statusText}\n*ErrorCode:* ${resp.status}`;
    await postToSlack(window.location, message);
  }

  resp.json = await resp.json();
  return resp;
}
