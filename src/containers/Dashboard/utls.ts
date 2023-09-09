import { IMatchObject } from "../../components/Dashboard";

export const findCurrentSpreads = (team?: string, data?: IMatchObject[]) => {
  if (team && data) {
    const currentMatch = data.find((_team) => {
      return _team.away_team === team || _team.home_team === team;
    });

    const spreads = currentMatch?.bookmakers[0].markets[0]?.outcomes.find(
      (__team) => __team.name === team
    );

    return {
      spreads,
    };
  }

  return null;
};

export const findCurrentTotats = (id: string, data: IMatchObject[]) => {
  const currentMatch = data.find((_team) => {
    return _team.id === id;
  });

  const totals = currentMatch?.bookmakers[0].markets[1]?.outcomes[0].point;

  return {
    totals,
    home_team: currentMatch?.home_team,
    away_team: currentMatch?.away_team,
  };
};
