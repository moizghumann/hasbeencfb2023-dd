export const EMAIL_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

console.log("process.env", process.env);

export const ODDS_API_KEY =
  process.env.ODDS_API_KEY || "76873652c65271f478f9fc077e2fe144";
//  "6e7fa3ee2940ac9c0a307b28ff7eaff8";
