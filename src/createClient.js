import _ from "lodash";
import axios from "axios";
import { fmResponseHandler } from "./handlers";
import FormData from "form-data";
import makeDebug from "debug";

const debug = makeDebug("fmdapi:createClient");

const fmReq = async opts => {
  const result = await axios(opts);
  return fmResponseHandler(result);
};

/**
 *
 * @param {Object} options default options for client
 * @param {string} options.serverUrl server url
 * @param {string} options.db database
 * @param {string} options.layout layout
 * @param {Object} options.params query
 * @param {string} options.token the fmdata api token or Otto API Key
 * @param {*} options.data data
 * @param {Enumerator} options.action one of 'create', 'delete', 'edit', 'getRecord', 'getRecords', 'find', 'upload', 'setGlobals'
 */

const PREFIX = `/fmi/data/v1/databases`;

const createClient = (options, store) => {
  let defaults = _.clone(options);
  let credentialStore = store;

  const request = async options => {
    const config = _.defaults({}, options, defaults);

    const opts = {
      baseURL: config.serverUrl,
      headers: {},
      params: config.params,
      validateStatus: status => true // don't reject any responses
    };
    if (config.token) {
      opts.headers["Authorization"] = `Bearer ${config.token}`;
    }

    if (config.action === "create") {
      opts.method = "POST";
      opts.data = config.data;
      opts.headers["Content-Type"] = "application/json";
      opts.url = `${PREFIX}/${config.db}/layouts/${config.layout}/records`;
      //
      //
    } else if (config.action === "delete") {
      opts.method = "DELETE";
      opts.url = `${PREFIX}/${config.db}/layouts/${config.layout}/records/${
        config.recordId
      }`;
      //
      //
    } else if (config.action === "edit") {
      opts.method = "PATCH";
      opts.data = config.data;
      opts.headers["Content-Type"] = "application/json";
      opts.url = `${PREFIX}/${config.db}/layouts/${config.layout}/records/${
        config.recordId
      }`;
      //
      //
    } else if (config.action === "getRecord") {
      opts.method = "GET";
      opts.headers["Content-Type"] = "application/json";
      opts.url = `${PREFIX}/${config.db}/layouts/${config.layout}/records/${
        config.recordId
      }`;
      //
      //
    } else if (config.action === "getRecords") {
      opts.method = "GET";
      opts.headers["Content-Type"] = "application/json";
      opts.url = `${PREFIX}/${config.db}/layouts/${config.layout}/records`;
      //
      //
    } else if (config.action === "upload") {
      let form = new FormData();
      form.append("upload", config.data);
      const formheaders = form.getHeaders();

      opts.method = "POST";
      opts.headers["Content-Type"] = formheaders["content-type"];
      opts.data = form;
      opts.url = `${PREFIX}/${config.db}/layouts/${config.layout}/records/${
        config.recordId
      }/containers/${
        config.containerFieldName
      }/${config.containerFieldRepetition || 1}/`;

      //
      //
    } else if (config.action === "find") {
      opts.method = "POST";
      opts.headers["Content-Type"] = "application/json";
      opts.url = `${PREFIX}/${config.db}/layouts/${config.layout}/_find`;
      opts.data = config.data;
      //
      //
    } else if (config.action === "setGlobals") {
      opts.method = "PATCH";
      opts.headers["Content-Type"] = "application/json";
      opts.url = `${PREFIX}/${config.db}/globals`;
      opts.data = config.data;
      //
      //
    } else if (config.action === "executeScript") {
      try {
        config.data = JSON.stringify(opts.data);
      } catch (error) {}
      opts.method = "GET";
      opts.headers["Content-Type"] = "application/json";
      opts.url = `${PREFIX}/${config.db}/layouts/${config.layout}/records`;
      opts.params = {
        script: config.scriptName,
        "script.param": config.data,
        _limit: 1
      };
      //
    }

    return await fmReq(opts);
  };

  const login = async credentials => {
    const endpoint =
      defaults.otto && credentials.apiKey ? "api-key" : "sessions";
    const opts = {
      method: "post",
      baseURL: defaults.serverUrl,
      url: `${PREFIX}/${defaults.db}/${endpoint}`,
      headers: { "Content-Type": "application/json" },
      validateStatus: status => true, // don't reject any responses
      auth: {
        username: credentials.username,
        password: credentials.password
      }
    };
    let loginResult;
    try {
      loginResult = await fmReq(opts);
      defaults.token = loginResult.response.token;
    } catch (error) {}

    return loginResult;
  };

  const logout = async token => {
    const endpoint =
      defaults.otto && credentials.apiKey ? "api-key" : "sessions";
    const opts = {
      method: "delete",
      baseURL: defaults.serverUrl,
      url: `${PREFIX}/${defaults.db}/${endpoint}/${token}`,
      validateStatus: status => true // don't reject any responses
    };

    let logoutResult;
    try {
      await fmReq(opts);
      defaults.token = null;
    } catch (error) {}

    return logoutResult;
  };

  const action = (action, options = {}) => {
    options["action"] = action;
    return request(options);
  };

  return {
    login,
    logout,
    request,
    create: options => action("create", options),
    delete: options => action("delete", options),
    edit: options => action("edit", options),
    getRecord: options => action("getRecord", options),
    getRecords: options => action("getRecords", options),
    upload: options => action("upload", options),
    find: options => action("find", options),
    setGlobals: options => action("setGlobals", options),
    executeScript: options => action("executeScript", options)
  };
};

export default createClient;
