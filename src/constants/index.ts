export const EMAIL_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

console.log(import.meta.env);

export const ODDS_API_KEY =
  import.meta.env.VITE_VERCEL_ODDS_API_KEY ||
  "45710ede53833fd76d543b75da1bc759";
