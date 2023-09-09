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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../slices/store";
import { setBets as setRBets } from "../../slices/app";
import { setDoc, doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import ConfirmModal from "./ConfirmModal";
import AllBets from "./AllBets";
import { findCurrentTotats, findCurrentSpreads } from "./utls";

export default function Dashboard() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { bets: RBets, currentUser } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();
  const { data, isLoading: getDataLoading } = useGetSportsData();

  const [allUsers, setAllUsers] = useState<{
    [key: string]: { name: string; email: string; points?: number };
  }>({});

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
      const betsWeeks = Object.keys(RBets).sort();

      if (betsWeeks.length > 0) {
        // lastest week bets
        const key = betsWeeks[betsWeeks.length - 1];

        const weekNumber = key.split("-")[1];
        if (
          !RBets["week-" + weekNumber].every(
            (bet) => bet.status !== "in-progress"
          )
        ) {
          setBets(RBets["week-" + weekNumber]);
        }

        if (
          RBets["week-" + weekNumber].length === 3 &&
          !RBets["week-" + weekNumber].every(
            (bet) => bet.status !== "in-progress"
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

  const onRemoveBet = (currentIndex: number) => {
    setBets(bets.filter((_, i) => i !== currentIndex));
  };

  useEffect(() => {
    let unsubscribeUsers: any = null;
    try {
      const usersQuery = collection(db, "users");
      unsubscribeUsers = onSnapshot(usersQuery, (querySnapshot) => {
        const uidsNameMap: {
          [key: string]: { name: string; email: string; points?: number };
        } = {};
        querySnapshot.docs.forEach((doc) => {
          uidsNameMap[doc.id] = {
            name: doc.data().name,
            email: doc.data().email,
            points: doc.data().points,
          };
        });

        setAllUsers(uidsNameMap);
      });
    } catch (error) {
      console.log(error);
    }

    () => {
      if (unsubscribeUsers) {
        return unsubscribeUsers();
      }
    };
  }, []);

  return (
    <Layout>
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onBetsSubmit}
        isLoading={isLoading}
      />
      <AllBets bets={data?.data} allUsers={allUsers} />
      <Stack direction={{ base: "column", md: "row" }} spacing="5">
        <Box w="full" maxW="500px" bg="white" p="5" rounded="lg">
          <Box>
            <Text fontSize="3xl" fontWeight={700} mb="2">
              YourCurrent Bets
            </Text>
            <TableContainer w="full">
              <Table
                variant="unstyled"
                colorScheme="gray"
                style={{ borderCollapse: "separate", borderSpacing: "0 1em" }}
              >
                <Thead>
                  <Tr bgColor="#F3F4F7">
                    <Th
                      fontSize="base"
                      textAlign="center"
                      display={isSubmittedForCurrentWeek ? "none" : "block"}
                    >
                      Action
                    </Th>
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
                  {bets.map((bet, i) => (
                    <Tr bgColor="#F3F4F7">
                      <Td
                        display={isSubmittedForCurrentWeek ? "none" : "block"}
                      >
                        <Button
                          size="xs"
                          colorScheme="red"
                          onClick={() => onRemoveBet(i)}
                        >
                          Remove
                        </Button>
                      </Td>
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
                        {
                          findCurrentSpreads(bet.team, data?.data)?.spreads
                            ?.point
                        }
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
          <Box mt="10">
            <Text fontSize="3xl" fontWeight={700} mb="2">
              Leader Board
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
                      User
                    </Th>
                    <Th fontSize="base" textAlign="center">
                      Score
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(allUsers).map((key) => {
                    return (
                      <Tr bgColor="#F3F4F7">
                        <Td key={key} textAlign="center">
                          {allUsers[key].email}
                        </Td>
                        <Td key={key} textAlign="center">
                          {allUsers[key].points !== undefined
                            ? allUsers[key].points
                            : 0}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
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
