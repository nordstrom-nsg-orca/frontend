export async function postToSlack(data) {
  const resp = await fetch("https://hooks.slack.com/services/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", {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return resp;
}
