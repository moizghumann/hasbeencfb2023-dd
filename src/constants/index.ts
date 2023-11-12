export const EMAIL_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const ODDS_API_KEY =
  import.meta.env.VITE_VERCEL_ODDS_API_KEY ||
  "45710ede53833fd76d543b75da1bc759";
