export const EMAIL_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const LIVE_KEY = "6e7fa3ee2940ac9c0a307b28ff7eaff8";

export const ODDS_API_KEY = process.env.ODDS_API_KEY || LIVE_KEY;
