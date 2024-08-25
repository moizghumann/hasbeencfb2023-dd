import { createSlice } from "@reduxjs/toolkit";

interface ICurrentUser {
  uid: string;
  email: string;
  name: string;
  points?: number;
  role?: string;
  // currentGuesses: {
  //   team: string;
  // }[];
  // currentTotalsGuesses: {
  //   id: string;
  //   totals: string;
  // }[];
}

interface SelectedBet {
  gameId: string;
  status: string;
  team?: string;
  type: string; // spread or totals
  spread?: number;
  totals?: string;
  point?: number;
  home_team?: string;
  away_team?: string;
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
  selectedBets: SelectedBet[];
} = {
  currentUser: null,
  bets: {},
  selectedBets: [],
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
    setSelectedBet: (state, action) => {
      state.selectedBets = action.payload;
    },
    resetAppState: (state) => {
      state.currentUser = null;
      state.bets = {};
      state.selectedBets = [];
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

export const { setCurrentUser, setBets, setSelectedBet, resetAppState } =
  appSlice.actions;

export default appSlice.reducer;
