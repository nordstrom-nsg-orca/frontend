import { postToSlack } from './reporter.js'

export async function api(path, options) {
  let url = `${process.env.REACT_APP_DB_API_URL}${path}`;
  
  if (options.method in ['DELETE', 'PUT']) {
    url += `/${options.data.id}`;
    delete options.data.id;
  }
  
  let opts = {
    method: options.method,
    headers: { 'x-api-key': options.token }
  }

  if (options.method in ['PUT', 'POST'])
    opts.body = JSON.stringify(options.data);
  
  const resp = await fetch(url, opts);

  if (resp.status !== 200) {
    const message = `ErrorMessage:* ${resp.statusText}\n*ErrorCode:* ${resp.status}`;
    await postToSlack(window.location, message);
  }

  const json = await resp.json();
  return json;
}


export async function tokenExchange(oAuthToken) {
  const url = `${process.env.REACT_APP_DB_API_URL}/token`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${oAuthToken}` } });
  const json = await resp.json();
  return json.apiKey;
}



// update = async (data) => {
// try {
//   let url = `${process.env.REACT_APP_DB_API_URL}/table/access_item/${data.id}`;
//   delete data['id'];
//   const resp = await fetch(url, {
//     method: 'PUT',
//     headers: { 'x-api-key': `${this.props.apiKey}` },
//     body: JSON.stringify(data)
//   });
//   if (resp.ok)
//     this.loadData();
// } catch (err) { this.setState({error: true}); }
// }

// delete = async (data) => {
// try {
//   let url = `${process.env.REACT_APP_DB_API_URL}/table/access_item/${data.id}`;
//   const resp = await fetch(url, {
//     method: 'DELETE',
//     headers: { 'x-api-key': `${this.props.apiKey}` }
//   });
//   if (resp.ok)
//     this.loadData();
// } catch(err) {
//   this.setState({error: true});
// }
// }

// create = async (data, id) => {
// try {
//   let url = `${process.env.REACT_APP_DB_API_URL}/table/access_item/`;
//   data['list_id'] = id;
//   const resp = await fetch(url, {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: { 'x-api-key': `${this.props.apiKey}` }
//   });
//   if (resp.ok) {
//     this.loadData();
//   } else {
//     const message = `ErrorMessage:* ${resp.statusText}\n*ErrorCode:* ${resp.status}\n*Function:* create()`;
//     await postToSlack(window.location, message);
//     this.setState({ error: true })
//   }
// } catch(err) {
//   const message = `ErrorMessage:* ${err}\n*ErrorCode:* 403\n*Function:* create()`;
//   await postToSlack(window.location, message);
//   this.setState({ error: true });
// }
// }