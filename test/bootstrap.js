global.expect = require("chai").expect;

import createClient from "../";

const defaultOpts = {
  serverUrl: "https://t.geistinteractive.com",
  db: "Test",
  layout: "People"
};

global.token = "";

global.client = createClient(defaultOpts);

before(async () => {
  const result = await client.login({ username: "admin", password: "admin" });
  token = result.response.token;

  await client.executeScript({ scriptName: "before" });
});

after(async () => {
  const result = await client.logout(token);
  token = "";
});
