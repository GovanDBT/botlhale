// lib/rollbar.ts
import Rollbar from "rollbar";

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_SERVER_TOKEN,
  environment: process.env.NODE_ENV || "development",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default rollbar;
