/**
 * convert objects and arrays to JSON
 * @param {*} data
 */
const prepParameter = data => {
  try {
    data = JSON.stringify(data);
  } catch (error) {
    //no op
  }
  return data;
};

/**
 *
 * @param {string} layout
 * @param {string} scriptName
 * @param {*} data
 */
const execScriptOptions = (layout, scriptName, data) => {
  return {
    url: `layouts/${layout}/records`,
    params: {
      script: scriptName,
      "script.param": prepParameter(data),
      _limit: 1
    }
  };
};

export { execScriptOptions };
