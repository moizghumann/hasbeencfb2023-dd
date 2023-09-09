import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Text,
  Td,
  VStack,
} from "@chakra-ui/react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { findCurrentTotats } from "./utls";

export default function AllBets({ bets, allUsers }: any) {
  const [allBets, setAllBets] = useState<{ id: string; guesses: any }[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const now = new Date();
    const saturdayTime = new Date();
    saturdayTime.setUTCHours(16, 0, 0); // 11 am CDT is 16:00 UTC
    saturdayTime.setDate(saturdayTime.getDate() + (6 - saturdayTime.getDay())); // Find the next Saturday

    const twentyFourHoursLater = new Date(saturdayTime);
    twentyFourHoursLater.setHours(twentyFourHoursLater.getHours() + 24);

    if (now >= saturdayTime && now < twentyFourHoursLater) {
      setShow(true);
    } else {
      setShow(false);
    }

    let unsubscribe: any = null;

    try {
      const q = collection(db, "bets");
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const _allBets = querySnapshot.docs.map((doc) => {
          const weeks = doc.data();
          const betsWeeks = Object.keys(weeks).sort();

          const lastestWeek = betsWeeks[betsWeeks.length - 1];

          return {
            id: doc.id,
            guesses: weeks[lastestWeek],
          };
        });

        setAllBets(_allBets);
      });
    } catch (error) {
      console.log(error);
    }

    () => {
      if (unsubscribe) {
        return unsubscribe();
      }
    };
  }, []);

  return show ? (
    <Box w="full" maxW="full" mb="5" bg="white" p="5" rounded="lg">
      <Text fontSize="3xl" fontWeight={700} mb="2">
        All Bets
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
                Name
              </Th>
              <Th fontSize="base" textAlign="center">
                Email
              </Th>
              <Th fontSize="base" textAlign="center">
                Guesses
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {allBets.map((bet) => (
              <Tr bgColor="#F3F4F7">
                <Td textAlign="center">{allUsers[bet.id].name}</Td>
                <Td textAlign="center">{allUsers[bet.id].email}</Td>
                <Td textAlign="center">
                  {bet.guesses.map((guess: any, i: number) => (
                    <>
                      {guess.type === "Spread" ? (
                        <>
                          <Text>
                            <Text fontWeight={500} as="span">
                              Bet No. {i + 1}{" "}
                            </Text>{" "}
                            Team: {guess.team}
                          </Text>
                          <br />
                        </>
                      ) : (
                        <>
                          <Text as="span" fontWeight={500}>
                            Bet No. {i + 1}
                          </Text>
                          <VStack
                            display="inline-flex"
                            justifyContent="center"
                            mb="5"
                          >
                            {/* <Text>Totals</Text> */}
                            <Text>
                              {guess.totals} {guess.point}
                            </Text>
                            <Box>
                              {bets
                                ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                  findCurrentTotats(guess.gameId, bets)
                                    .home_team
                                : null}
                              <br />
                              vs
                              <br />
                              {bets
                                ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                  findCurrentTotats(guess.gameId, bets)
                                    .away_team
                                : null}
                            </Box>
                          </VStack>
                        </>
                      )}
                    </>
                  ))}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  ) : null;
}
