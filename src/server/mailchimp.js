const request = require('request-promise');

const mailchimpConfig = {
  baseUrl: 'https://us20.api.mailchimp.com/3.0',
  username: 'any',
  password: 'a25f82c562f5b7c18ec76f0ce0adabef-us20',
};

function actualMailchimpRequest(req) {
  const defaultHeaders = {
    // eslint-disable-next-line
    'content-type': 'application/json',
    Authorization: `Basic ${Buffer(`${mailchimpConfig.username}:${mailchimpConfig.password}`).toString('base64')}`,
  };
  const path = req.path.replace(/\/api\/mailchimp/g, '');
  const options = {
    url: `${mailchimpConfig.baseUrl}${path}`,
    method: req.method,
    headers: defaultHeaders,
    json: true,
  };
  if (req.params) {
    options.qs = req.query;
  }

  if (req.body) {
    options.body = req.body;
  }
  return request(options);
}

/**
 *  Forwards the mailchimp request to mailchimp server and returns the response.
 * @property {Request} req - The type of request to be forwarded.
 * @returns {Response}
 */
function mailchimpRequest(req, res) {
  actualMailchimpRequest(req)
    .then(response => res.send(response))
    .catch((err) => {
      const status = err.statusCode || 500;
      return res.status(status).send(err);
    });
}

module.exports = { mailchimpRequest, actualMailchimpRequest };
