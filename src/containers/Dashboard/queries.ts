import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ODDS_API_KEY } from "../../constants";
import { IMatchObject } from "../../components/Dashboard";

export const useGetSportsData = () => {
  const getSportsData = async () => {
    const res = await axios.get<IMatchObject[]>(
      `https://api.the-odds-api.com/v4/sports/americanfootball_ncaaf/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=spreads,totals`
    );
    return res;
  };

  return useQuery({
    queryKey: ["sportsOddsData"],
    queryFn: () => getSportsData(),
  });
};
