import { useEffect, useState } from "react";
import { CDashboard, Layout } from "../../components";
import { useGetSportsData } from "./queries";
import {
  Box,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { IMatchObject } from "../../components/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../slices/store";
import { setBets as setRBets } from "../../slices/app";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import ConfirmModal from "./ConfirmModal";

const findCurrentSpreads = (team?: string, data?: IMatchObject[]) => {
  if (team && data) {
    const currentMatch = data.find((_team) => {
      return _team.away_team === team || _team.home_team === team;
    });

    const spreads = currentMatch?.bookmakers[0].markets[0].outcomes.find(
      (__team) => __team.name === team
    );

    return {
      spreads,
    };
  }

  return null;
};

const findCurrentTotats = (id: string, data: IMatchObject[]) => {
  const currentMatch = data.find((_team) => {
    return _team.id === id;
  });

  const totals = currentMatch?.bookmakers[0].markets[1].outcomes[0].point;

  return {
    totals,
    home_team: currentMatch?.home_team,
    away_team: currentMatch?.away_team,
  };
};

export default function Dashboard() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { bets: RBets, currentUser } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();
  const { data, isLoading: getDataLoading } = useGetSportsData();

  const [bets, setBets] = useState<
    {
      gameId: string;
      status: string;
      team?: string;
      type: string; // spread or totals
      spread?: number;
      totals?: string;
      point?: number;
    }[]
  >([]);

  const [isSubmittedForCurrentWeek, setIsSubmittedForCurrentWeek] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: need check if this bet is resovled or not
    if (currentUser) {
      const betsWeeks = Object.keys(RBets);
      if (betsWeeks.length > 0) {
        const key = betsWeeks[betsWeeks.length - 1];

        const weekNumber = key.split("-")[1];
        if (
          !RBets["week-" + weekNumber].every(
            (bet) => bet.status === "completed"
          )
        ) {
          setBets(RBets["week-" + weekNumber]);
        }

        if (
          RBets["week-" + weekNumber].length === 3 &&
          !RBets["week-" + weekNumber].every(
            (bet) => bet.status === "completed"
          )
        ) {
          setIsSubmittedForCurrentWeek(true);
        }
      }
    }

    () => {
      setBets([]);

      return;
    };
  }, [RBets]);

  const onSetBet = (bet: {
    gameId: string;
    status: string;
    team?: string;
    type: string; // spread or totals
    spread?: number;
    totals?: string;
    point?: number;
  }) => {
    setBets((prevState) => [
      ...prevState,
      {
        ...bet,
      },
    ]);
  };

  const removeBet = (gameId: string, type: string) => {
    setBets(
      bets.filter((bet) => {
        return bet.gameId !== gameId || type !== bet.type;
      })
    );
  };

  const onBetsSubmit = async () => {
    if (currentUser) {
      setIsLoading(true);
      const betsWeeks = Object.keys(RBets);
      const isPrevWeek = betsWeeks.length > 0;

      const __data = {
        "week-1": [...bets],
      };

      if (!isPrevWeek) {
        dispatch(setRBets(__data));

        const betsRef = doc(db, "bets", currentUser?.uid);

        await setDoc(betsRef, __data, { merge: true });

        setIsSubmittedForCurrentWeek(true);
        setIsLoading(false);
        return;
      }

      const key = betsWeeks[betsWeeks.length - 1];

      const weekNumber = key.split("-")[1];

      const _data = {
        ...RBets,
        [`week-${+weekNumber + 1}`]: [...bets],
      };

      dispatch(setRBets(_data));

      const betsRef = doc(db, "bets", currentUser?.uid);

      await setDoc(betsRef, _data, { merge: true });

      setIsLoading(false);
      setIsSubmittedForCurrentWeek(true);
    }
  };

  return (
    <Layout>
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onBetsSubmit}
        isLoading={isLoading}
      />
      <Stack direction={{ base: "column", md: "row" }}>
        <Box w="full" maxW="500px" bg="white" p="5" rounded="lg">
          <Text fontSize="3xl" fontWeight={700} mb="2">
            Current Bets
          </Text>
          <TableContainer w="full">
            <Table
              variant="unstyled"
              colorScheme="gray"
              style={{ borderCollapse: "separate", borderSpacing: "0 1em" }}
            >
              <Thead>
                <Tr bgColor="#F3F4F7">
                  <Th fontSize="base" textAlign="center">
                    Team(s)
                  </Th>
                  <Th fontSize="base" textAlign="center">
                    Spread
                  </Th>
                  <Th fontSize="base" textAlign="center">
                    U/O
                  </Th>
                  <Th fontSize="base" textAlign="center">
                    Bet Type
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {bets.map((bet) => (
                  <Tr bgColor="#F3F4F7">
                    <Td textAlign="center">
                      {bet.type === "totals" ? (
                        <>
                          {data?.data
                            ? findCurrentTotats(bet.gameId, data?.data)
                                .home_team
                            : null}
                          <br />
                          vs
                          <br />
                          {data?.data
                            ? findCurrentTotats(bet.gameId, data?.data)
                                .away_team
                            : null}
                        </>
                      ) : (
                        bet.team
                      )}
                    </Td>
                    <Td textAlign="center">
                      {findCurrentSpreads(bet.team, data?.data)?.spreads?.point}
                    </Td>
                    <Td textAlign="center">
                      {bet.type === "totals" ? (
                        <>
                          {bet.totals}
                          <br />
                          {bet.point}
                        </>
                      ) : null}
                    </Td>
                    <Td textAlign="center">{bet.type}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Button
            colorScheme="orange"
            isDisabled={bets.length !== 3 || isSubmittedForCurrentWeek}
            mt="5"
            w="full"
            onClick={onOpen}
          >
            Submit
          </Button>
        </Box>
        <CDashboard
          data={data?.data}
          isLoading={getDataLoading}
          onSetBet={onSetBet}
          bets={bets}
          isSubmittedForCurrentWeek={isSubmittedForCurrentWeek}
          removeBet={removeBet}
        />
      </Stack>
    </Layout>
  );
}
