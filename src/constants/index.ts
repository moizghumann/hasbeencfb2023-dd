export const EMAIL_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

console.log(import.meta.env);

console.log("process.env", import.meta.env.ODDS_API_KEY);

export const ODDS_API_KEY =
  import.meta.env.MODE === "production"
    ? "6e7fa3ee2940ac9c0a307b28ff7eaff8"
    : "45710ede53833fd76d543b75da1bc759";
