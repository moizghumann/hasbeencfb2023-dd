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
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../slices/store";
import { setBets as setRBets } from "../../slices/app";
import { setDoc, doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import AllBets from "./AllBets";

export default function Dashboard() {
  const toast = useToast();

  // const { onClose } = useDisclosure();

  const { bets: RBets, currentUser } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();
  const { data, isLoading: getDataLoading } = useGetSportsData();

  const [allUsersMap, setAllUsersMap] = useState<{
    [key: string]: { id: string; name: string; email: string; points: number };
  }>({});

  const [allUsers, setAllUsers] = useState<
    { id: string; name: string; email: string; points: number }[]
  >([]);

  const [bets, setBets] = useState<
    {
      gameId: string;
      status: string;
      team?: string;
      type: string; // spread or totals
      spread?: number;
      totals?: string;
      point?: number;
      home_team?: string;
      away_team?: string;
    }[]
  >([]);

  const [isSubmittedForCurrentWeek, setIsSubmittedForCurrentWeek] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    // TODO: need check if this bet is resovled or not
    if (currentUser) {
      let betsWeeksNo = Object.keys(RBets).map((w) => +w.replace("week-", ""));

      betsWeeksNo = betsWeeksNo.sort((a, b) => a - b);

      console.log("betsWeeksNo", betsWeeksNo);

      if (betsWeeksNo.length > 0) {
        // latest week bets
        const weekNumber = betsWeeksNo[betsWeeksNo.length - 1];

        // const weekNumber = key.split("-")[1];
        if (
          !RBets["week-" + String(weekNumber)].every(
            (bet) => bet.status !== "in-progress"
          )
        ) {
          setBets(RBets["week-" + String(weekNumber)]);
        }

        if (
          RBets["week-" + String(weekNumber)].length === 3 &&
          !RBets["week-" + String(weekNumber)].every(
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
    try {
      if (currentUser) {
        setIsLoading(true);
        let betsWeeksNo = Object.keys(RBets).map(
          (w) => +w.replace("week-", "")
        );

        betsWeeksNo = betsWeeksNo.sort((a, b) => a - b);

        const isPrevWeek = betsWeeksNo.length > 0;

        const __data = {
          "week-1": [...bets],
        };

        if (!isPrevWeek) {
          dispatch(setRBets(__data));

          const betsRef = doc(db, "bets", currentUser?.uid);

          await setDoc(betsRef, __data, { merge: true });

          setIsSubmittedForCurrentWeek(true);
          setIsLoading(false);

          // toast({
          //   title: "Success",
          //   description: "Bets Submitted Successfully!",
          //   duration: 4000,
          //   position: "top-right",
          //   isClosable: true,
          //   status: "success",
          // });
          // onClose();
          return;
        }

        const weekNumber = betsWeeksNo[betsWeeksNo.length - 1];

        // const weekNumber = key.split("-")[1];

        const _data = {
          ...RBets,
          [`week-${+weekNumber + 1}`]: [...bets],
        };

        dispatch(setRBets(_data));

        const betsRef = doc(db, "bets", currentUser?.uid);

        await setDoc(betsRef, _data, { merge: true });

        setIsLoading(false);
        setIsSubmittedForCurrentWeek(true);

        // toast({
        //   title: "Success",
        //   description: "Bets Submitted Successfully!",
        //   duration: 4000,
        //   position: "top-right",
        //   isClosable: true,
        //   status: "success",
        // });
        // onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong please try again!",
        duration: 4000,
        position: "top-right",
        isClosable: true,
        status: "error",
      });
      setIsLoading(false);
      console.log("SUBMIT_BET_ERROR", error);
    }
  };

  const onRemoveBet = (currentIndex: number) => {
    setBets(bets.filter((_, i) => i !== currentIndex));
  };

  useEffect(() => {
    const now = new Date();
    const saturdayTime = new Date();
    saturdayTime.setUTCHours(17, 0, 0); // 11 am CDT is 16:30 UTC
    saturdayTime.setDate(saturdayTime.getDate() + (6 - saturdayTime.getDay())); // Find the next Saturday

    const twentyFourHoursLater = new Date(saturdayTime);

    console.log(twentyFourHoursLater);

    twentyFourHoursLater.setHours(twentyFourHoursLater.getHours() + 24);

    if (now >= saturdayTime && now < twentyFourHoursLater) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, []);

  useEffect(() => {
    let unsubscribeUsers: any = null;
    try {
      const usersQuery = collection(db, "users");
      unsubscribeUsers = onSnapshot(usersQuery, (querySnapshot) => {
        const uidsNameMap: {
          [key: string]: {
            id: string;
            name: string;
            email: string;
            points: number;
          };
        } = {};
        const _allUsers = querySnapshot.docs
          .map((doc) => {
            uidsNameMap[doc.id] = {
              id: doc.id,
              name: doc.data().name,
              email: doc.data().email,
              points: doc.data().points !== undefined ? doc.data().points : 0,
            };

            return {
              id: doc.id,
              name: doc.data().name,
              email: doc.data().email,
              points: doc.data().points !== undefined ? doc.data().points : 0,
            };
          })
          .sort((a, b) => b.points - a.points);

        setAllUsers(_allUsers);

        setAllUsersMap(uidsNameMap);
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
      {/* <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onBetsSubmit}
        isLoading={isLoading}
      /> */}

      <AllBets bets={data?.data} allUsers={allUsersMap} />
      <Accordion allowMultiple mb="5">
        <AccordionItem
          bg="white"
          display={{ base: "block", md: "none" }}
          borderRadius={"xl"}
        >
          <h2>
            <AccordionButton rounded="md">
              <Stack
                direction="row"
                justifyContent="space-between"
                w="full"
                alignItems="center"
              >
                <Text fontSize="2xl" fontWeight={700} my="1">
                  Your Current Bets
                </Text>

                <AccordionIcon />
              </Stack>
            </AccordionButton>
          </h2>
          <AccordionPanel>
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
                            {bet.home_team}
                            <br />
                            vs
                            <br />
                            {bet.away_team}
                          </>
                        ) : (
                          bet.team
                        )}
                      </Td>
                      <Td textAlign="center">{bet.spread}</Td>
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
              isDisabled={
                bets.length !== 3 || isSubmittedForCurrentWeek || isDisabled
              }
              mt="5"
              w="full"
              onClick={onBetsSubmit}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Accordion allowMultiple mb="5">
        <AccordionItem
          bg="white"
          display={{ base: "block", md: "none" }}
          borderRadius={"xl"}
        >
          <h2>
            <AccordionButton rounded="md">
              <Stack
                direction="row"
                justifyContent="space-between"
                w="full"
                alignItems="center"
              >
                <Text fontSize="2xl" fontWeight={700} my="1">
                  Leader Board
                </Text>

                <AccordionIcon />
              </Stack>
            </AccordionButton>
          </h2>
          <AccordionPanel>
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
                  {allUsers.map((user) => {
                    return (
                      <Tr bgColor="#F3F4F7">
                        <Td key={user.id} textAlign="center">
                          {user?.name}
                        </Td>
                        <Td textAlign="center">
                          {user?.points !== undefined ? user?.points : 0}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing="5"
        maxHeight={"88vh"}
      >
        <Box
          w="full"
          maxW="500px"
          bg="white"
          p="5"
          rounded="lg"
          overflowY={"auto"}
          minH="88vh"
          display={{ base: "none", md: "block" }}
        >
          <Box>
            <Text fontSize="3xl" fontWeight={700} mb="2">
              Your Current Bets
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
                            {bet.home_team}
                            <br />
                            vs
                            <br />
                            {bet.away_team}
                          </>
                        ) : (
                          bet.team
                        )}
                      </Td>
                      <Td textAlign="center">{bet.spread}</Td>
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
              isDisabled={
                bets.length !== 3 || isSubmittedForCurrentWeek || isDisabled
              }
              mt="5"
              w="full"
              onClick={onBetsSubmit}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </Box>
          <Box mt="10">
            <Text fontSize="3xl" fontWeight={700} my="1">
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
                  {allUsers.map((user) => {
                    return (
                      <Tr bgColor="#F3F4F7">
                        <Td key={user.id} textAlign="center">
                          {user?.name}
                        </Td>
                        <Td textAlign="center">
                          {user?.points !== undefined ? user?.points : 0}
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

// while (retryAttempts < MAX_RETRY_ATTEMPTS) {
//   try {
//     await new Promise((resolve) => setTimeout(resolve, backoffDelay));

//     const res = await axios.get(
//       `${API_SCORES_URL}/?apiKey=${ODDS_API_KEY}&eventIds=${gameId}&daysFrom=3`
//     );

//     const games = res.data;

//     if (games) {
//       const game = games[0];

//       // games is completed!
//       if (game && game?.completed) {
//         let homeScore = parseInt(game.scores[0].score);
//         let awayScore = parseInt(game.scores[1].score);

//         if (game.scores[0].name === bet.team) {
//           homeScore += bet.spread;
//         } else if (game.scores[1].name === bet.team) {
//           awayScore += bet.spread;
//         }

//         const totalGameScore =
//           parseInt(game.scores[0].score) +
//           parseInt(game.scores[1].score);

//         let isTie = false;
//         let winner = "";

//         if (bet.type === "Spread") {
//           if (homeScore > awayScore) {
//             winner = game.home_team;
//           } else if (homeScore < awayScore) {
//             winner = game.away_team;
//           } else {
//             isTie = "It's a tie!";
//           }

//           if (winner === bet.team) {
//             totalPoints += 1;
//           }
//           if (isTie) {
//             totalPoints += 0;
//           }
//         }

//         if (bet.type === "totals") {
//           if (bet.totals === "Over" && totalGameScore > +bet.point) {
//             winner = bet.team;
//             totalPoints += 1;
//           }

//           if (bet.totals === "Under" && totalGameScore < +bet.point) {
//             winner = bet.team;
//             totalPoints += 1;
//           }

//           if (bet.total === totalGameScore) {
//             // winner = bet.team;
//             totalPoints += 0;
//           }
//         }

//         _bets[i] = {
//           ...bet,
//           status: winner === bet.team ? "win" : "lost",
//           gainedPoints: totalGameScore,
//         };
//       }
//     }

//     break; // Break out of the retry loop if the request is successful
//   } catch (error) {
//     if (error.response && error.response.status === 429) {
//       // Retry the request with exponential backoff
//       retryAttempts++;
//       backoffDelay *= 2;
//     } else {
//       throw error; // Throw the error if it's not a 429 error
//     }
//   }
// }
