const request = require('request');
const crypto = require('crypto');
const {
  format,
  isAfter,
  addSeconds,
} = require('date-fns');
const url = require('url');
const util = require('lodash');
const defaultTimestampFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
let token;

/**
 * BCA Class
 */
class BCA {

  /**
   * BCA Constructor class
   * @param {Object} config - Config object containing api_host, client_id, client_secret, etc...
   */
  constructor(config) {
    this.config = config;
    this.config.timestampFormat = this.config.timestampFormat || defaultTimestampFormat;
  }

  /**
   * Get api token
   * @return {Promise<Object>} - Promise resolved containing the access_token
   */
  async getToken() {
    const currentDate = new Date();
    if (util.get(token, 'access_token')
      && util.get(token, 'expires_at')
      && isAfter(token.expires_at, currentDate)) {
      return token;
    }
    const newToken = await this.apiCall({
      port: this.config.api_port,
      url: `${this.config.api_host}/api/oauth/token`,
      method: 'POST',
      form: {
        grant_type: 'client_credentials',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.config.client_id}:${this.config.client_secret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    newToken.expires_at = addSeconds(currentDate, newToken.expires_in);
    token = newToken;
    return token;
  }

  /**
   * Make a request to BCA API
   * @param {String} param.method - Request method (POST, GET, PUT)
   * @param {String} param.relativeUrl - Request relative url
   * @param {String} param.body - Stringified Request body
   * @return {Promise<Object,Error>} - Promised resolved with response json data
   */
  async request({
    method = 'POST',
    body = '',
    relativeUrl,
  }) {
    const token = await this.getToken();
    const timestamp = format(new Date(), this.config.timestampFormat);
    const signature =  await this.getSignature({
      accessToken: token.access_token,
      body,
      method,
      relativeUrl,
      timestamp,
    });
    return this.apiCall({
      method,
      body,
      port: this.config.api_port,
      url: `${this.config.api_host}${relativeUrl}`,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
        'Origin': this.config.origin,
        'X-BCA-Key': this.config.api_key,
        'X-BCA-Timestamp': timestamp,
        'X-BCA-Signature': signature,
      },
    });
  }

  /**
   * Wrap request into promise
   * @param {Object} options - Request option
   * @return {Promise<Object,Error>} - Promised resolved with response json data
   * @throws {Error} - If the response throws an error (Timeout, Server is not available, etc)  
   */
  apiCall(options) {
    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        return resolve(JSON.parse(body));
      });
    });
  }

  /**
   * Get BCA API Signature
   * @param {String} params.relativeUrl - URL request
   * @param {String} params.accessToken - BCA access_token
   * @param {String} params.method - HTTP request method -> GET, POST, etc...
   * @param {String} params.timestamp - Timestamp of the request
   * @param {String} params.body - Request body or '' for GET request
   * @return {String} - HMAC256 signature
   */
  async getSignature({
    relativeUrl,
    accessToken,
    method,
    timestamp,
    body,
  }) {
    const hmac = crypto.createHmac('sha256', this.config.api_secret);
    const sha256 = crypto.createHash('sha256');
    const sha256Body = sha256.update(body.replace(/\s/g, ''));
    const digestedBody = sha256Body.digest('hex');
    const signature = hmac.update(`${method}:${encodeURI(relativeUrl)}:${accessToken}:${digestedBody}:${timestamp}`);
    return signature.digest('hex');
  }

  /**
   * Sort url query param
   * Input:
   *   https://sandbox.bca.co.id/api/v2/sample?A-param=value1&Z-param=value2&B-param=value3
   * Output:
   *   https://sandbox.bca.co.id/api/v2/sample?A-param=value1&B-param=value3&Z-param=value2
   * @param {String} requestUrl - Request url, example: https://sandbox.bca.co.id/api/v2/sample?A-param=value1&B-param=value3&Z-param=value2
   * @return {String} If there's any query params, it will be sorted
   */
  sortQueryParams(requestUrl) {
    const urlParts = url.parse(requestUrl, true);
    const params = urlParts.query;
    // If there's any query params, make sure that it's ordered
    if (params && Object.keys(params).length) {
      const sortedQuery = util(params).toPairs().sortBy(0).fromPairs().value();
      const queryString = Object.keys(sortedQuery).map(key => key + '=' + params[key]).join('&');
      return `${requestUrl.split('?').shift()}?${queryString}`;
    }
    return requestUrl;
  }

  /**
   * Clear token cache (use new one)
   */
  clearTokenCache() {
    token = null;
  }
}

module.exports = BCA;
