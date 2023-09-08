import { createSlice } from "@reduxjs/toolkit";

interface ICurrentUser {
  uid: string;
  email: string;
  name: string;
  // currentGuesses: {
  //   team: string;
  // }[];
  // currentTotalsGuesses: {
  //   id: string;
  //   totals: string;
  // }[];
}

interface IBets {
  [key: string]: {
    gameId: string;
    status: string;
    team: string;
    type: string; // spread or totals
    totals?: string; // over / under,
  }[];
}

const initialState: {
  currentUser: ICurrentUser | null;
  bets: IBets;
} = {
  currentUser: null,
  bets: {},
};

const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setBets: (state, action) => {
      state.bets = { ...action.payload };
    },
    // setCurrentGuesses: (state, action) => {
    //   if (state.currentUser) {
    //     state.currentUser.currentGuesses = action.payload;
    //   }
    // },
    // setTotalsGuesses: (state, action) => {
    //   if (state.currentUser) {
    //     state.currentUser.currentTotalsGuesses = action.payload;
    //   }
    // },
  },
});

export const { setCurrentUser, setBets } = appSlice.actions;

export default appSlice.reducer;
