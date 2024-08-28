export const EMAIL_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const ODDS_API_KEY =
  import.meta.env.VITE_VERCEL_ODDS_API_KEY ||
  "3d8db7f9bf847d840ba6b9f6a75dcf95";
