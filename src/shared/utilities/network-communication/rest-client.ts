import axios from 'axios';
import { BASE_URL, API_KEY } from '../../../../configs';
let _this;

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const headerConfig = {
  headers: {
    'Content-Type': 'application/json',
    'SayuruAPIKey': API_KEY,
  },
};

class RestClient {
  constructor() {
    _this = this;
  }

  /**
   * Main method call for all rest calls with in logic
   *
   * @param {any} method
   * @param {any} url
   * @param {any} body
   * @param {any} header
   * @returns
   * @memberof RestClient
   */
  API(method: string, url: string, body: any, header: any = {}, timeout?: number) {
    const _url = BASE_URL + url;
    switch (method) {
      case METHODS.GET:
        return this._get(_url, { ...headerConfig.headers, ...header }, timeout);
      case METHODS.POST:
        body = body || {};
        return this._post(_url, body, { ...headerConfig.headers, ...header }, timeout);
      case METHODS.PUT:
        return this._put(_url, body, { ...headerConfig.headers, ...header }, timeout);
      case METHODS.DELETE:
        return this._delete(_url, body, { ...headerConfig.headers, ...header }, timeout);
      default:
        break;
    }
  }

  /**
   * GET Rest API Call
   *
   * @param {any} url
   * @param {any} header
   * @returns
   * @memberof RestClient
   */
  async _get(url: string, header: string, timeout = 25000) {
    axios.defaults.timeout = timeout;
    return axios
      .get(url, { headers: header })
  }

  /**
   * POST Rest API Call
   *
   * @param {any} url
   * @param {any} body
   * @param {any} header
   * @returns
   * @memberof RestClient
   */
  async _post(url: string, body: any, header: any, timeout = 25000) {
    axios.defaults.timeout = timeout;
    return axios
      .post(url, body, { headers: header })
  }

  /**
   * PUT Rest API Call
   *
   * @param {any} url
   * @param {any} body
   * @param {any} header
   * @returns
   * @memberof RestClient
   */
  async _put(url: string, body: any, header: any, timeout = 25000) {
    axios.defaults.timeout = timeout;
    return axios
      .put(url, body, { headers: header })
  }

  /**
   * DELETE Rest API Call
   *
   * @param {any} url
   * @param {any} header
   * @returns
   * @memberof RestClient
   */
  async _delete(url: string, body: any, header: any, timeout = 25000) {
    axios.defaults.timeout = timeout;
    return axios
      .delete(url, { headers: header, data: body })
  }
}

export const client = new RestClient();
