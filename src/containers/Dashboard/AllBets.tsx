/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  Button,
  HStack,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Stack,
  AccordionIcon,
} from "@chakra-ui/react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { RootState } from "../../slices/store";
import GuessesModal from "../../components/Dashboard/GuessesModel";

export default function AllBets({ allUsers }: any) {
  const [allBets, setAllBets] = useState<{ id: string; guesses: any }[]>([]);
  const [show, setShow] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      setShow(true);
    } else {
      const now = new Date();
      const saturdayTime = new Date();
      saturdayTime.setUTCHours(16, 0, 0); // 11 am CDT is 16:00 UTC
      saturdayTime.setDate(
        saturdayTime.getDate() + (6 - saturdayTime.getDay())
      ); // Find the next Saturday

      const twentyFourHoursLater = new Date(saturdayTime);
      twentyFourHoursLater.setHours(twentyFourHoursLater.getHours() + 24);

      if (now >= saturdayTime && now < twentyFourHoursLater) {
        setShow(true);
      } else {
        setShow(false);
      }
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
  }, [currentUser]);

  return show ? (
    <>
      <Accordion allowMultiple mb="5">
        <AccordionItem bg="white" display={{ base: "block", md: "none" }} >
          <h2>
            <AccordionButton rounded="md" borderRadius={'xl'}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                w="full"
                justifyContent="space-between"
                alignItems="center"
                
              >
                <Text fontSize="3xl" fontWeight={700} mb="2">
                  All Bets
                </Text>
                {currentUser?.role === "admin" ? (
                  <Button
                    as="a"
                    variant="solid"
                    colorScheme="orange"
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    href={`mailto:${Object.values(allUsers)
                      .map((user: any) => user.email)
                      .join(",")}?subject=${encodeURIComponent(
                      "This Week's Bets"
                    )}&body=${encodeURIComponent(
                      allBets
                        .map((bet) =>
                          bet.guesses
                            .map(
                              (guess: any) =>
                                `User Email: ${allUsers[bet.id]?.email} Type: ${
                                  guess.type
                                } Status: ${guess.status} Team: ${guess.team}`
                            )
                            .join("\n")
                        )
                        .join("\n")
                    )}`}
                  >
                    Send Email To All
                  </Button>
                ) : null}
              </Stack>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <Box w="full" maxW="full" mb="5" bg="white" rounded="lg">
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
                        Guesses
                      </Th>
                      {currentUser?.role === "admin" ? <Th>Action</Th> : null}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {allBets.map((bet) => (
                      <Tr bgColor="#F3F4F7">
                        <Td textAlign="center">{allUsers[bet.id]?.name}</Td>
                        <Td textAlign="center">
                          <GuessesModal>
                            <Box overflowX={"auto"} whiteSpace={"nowrap"}>
                              <Table marginBottom={"10px"}>
                                <Thead>
                                  <Th textAlign="center">No.</Th>
                                  <Th textAlign="center">Game/Team</Th>
                                  <Th textAlign="center">Status</Th>
                                  <Th textAlign="center">Type</Th>
                                  <Th textAlign="center">Locked At</Th>
                                </Thead>
                                <Tbody>
                                  {bet.guesses.map((guess: any, i: number) => (
                                    <Tr
                                      bgColor={"#F3F4F7"}
                                      marginBottom={"20px"}
                                      border={"2px"}
                                      borderColor={"#bdbdbd"}
                                    >
                                      {guess.type === "Spread" ? (
                                        <>
                                          <Td fontWeight={500} fontSize="sm">
                                            {i + 1}
                                          </Td>
                                          <Td textAlign="center" fontSize="sm">
                                            {guess.team}
                                          </Td>
                                          <Td
                                            textAlign="center"
                                            fontWeight={500}
                                            fontSize="sm"
                                          >
                                            <Badge colorScheme="green">
                                              {guess.status}
                                            </Badge>
                                          </Td>
                                          <Td textAlign="center">Spread</Td>
                                          <Td textAlign="center">
                                            {guess.spread}
                                          </Td>
                                        </>
                                      ) : (
                                        <>
                                          <Td fontWeight={500} fontSize="sm">
                                            {i + 1}
                                          </Td>
                                          <Td fontSize="sm">
                                            <VStack
                                              justifyContent="center"
                                              mb="5"
                                            >
                                              <Text textAlign="center">
                                                {guess.home_team}
                                              </Text>
                                              <Text textAlign="center">vs</Text>
                                              <Text textAlign="center">
                                                {guess.away_team}
                                              </Text>
                                            </VStack>
                                          </Td>
                                          <Td
                                            textAlign="center"
                                            fontWeight={500}
                                            fontSize="sm"
                                          >
                                            <Badge colorScheme="green">
                                              {guess.status}
                                            </Badge>
                                          </Td>
                                          <Td textAlign="center">Totals</Td>
                                          <Td textAlign="center">
                                            <Text>{guess.totals}</Text>
                                            <Text>{guess.point}</Text>
                                          </Td>
                                        </>
                                      )}
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                            </Box>
                          </GuessesModal>
                        </Td>
                        {currentUser?.role === "admin" ? (
                          <Td>
                            <Button
                              as="a"
                              variant="solid"
                              colorScheme="orange"
                              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                              href={`mailto:${
                                allUsers[bet.id]?.email
                              }?subject=${
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                allUsers[bet.id]?.name
                              }%20%Bets%20%this%20%&body=${`
                     ${bet.guesses.map((game: any, i: number) => {
                       return `game ${i + 1}: ${game.status}`;
                     })}
                     `}`}
                              size="sm"
                            >
                              Send Email
                            </Button>
                          </Td>
                        ) : null}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Box
        display={{ base: "none", md: "block" }}
        w="full"
        maxW="full"
        mb="5"
        bg="white"
        p="5"
        rounded="lg"
      >
        <HStack justifyContent="space-between">
          <Text fontSize="2xl" fontWeight={700} mb="2">
            All Bets
          </Text>
          {currentUser?.role === "admin" ? (
            <Button
              as="a"
              variant="solid"
              colorScheme="orange"
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              href={`mailto:${Object.values(allUsers)
                .map((user: any) => user.email)
                .join(",")}?subject=${encodeURIComponent(
                "This Week's Bets"
              )}&body=${encodeURIComponent(
                allBets
                  .map((bet) =>
                    bet.guesses
                      .map(
                        (guess: any) =>
                          `User Email: ${allUsers[bet.id]?.email} Type: ${
                            guess.type
                          } Status: ${guess.status} Team: ${guess.team}`
                      )
                      .join("\n")
                  )
                  .join("\n")
              )}`}
            >
              Send Email To All
            </Button>
          ) : null}
        </HStack>
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
                  Guesses
                </Th>
                {currentUser?.role === "admin" ? <Th>Action</Th> : null}
              </Tr>
            </Thead>
            <Tbody>
              {allBets.map((bet) => (
                <Tr bgColor="#F3F4F7">
                  <Td textAlign="center">{allUsers[bet.id]?.name}</Td>
                  <Td textAlign="center">
                    <GuessesModal>
                      <Box overflowX={"auto"} whiteSpace={"nowrap"}>
                        <Table marginBottom={"10px"}>
                          <Thead>
                            <Th textAlign="center">No.</Th>
                            <Th textAlign="center">Game/Team</Th>
                            <Th textAlign="center">Status</Th>
                            <Th textAlign="center">Type</Th>
                            <Th textAlign="center">Locked At</Th>
                          </Thead>
                          <Tbody>
                            {bet.guesses.map((guess: any, i: number) => (
                              <Tr
                                bgColor={"#F3F4F7"}
                                marginBottom={"20px"}
                                border={"2px"}
                                borderColor={"#bdbdbd"}
                              >
                                {guess.type === "Spread" ? (
                                  <>
                                    <Td fontWeight={500} fontSize="sm">
                                      {i + 1}
                                    </Td>
                                    <Td textAlign="center" fontSize="sm">
                                      {guess.team}
                                    </Td>
                                    <Td
                                      textAlign="center"
                                      fontWeight={500}
                                      fontSize="sm"
                                    >
                                      <Badge colorScheme="green">
                                        {guess.status}
                                      </Badge>
                                    </Td>
                                    <Td textAlign="center">Spread</Td>
                                    <Td textAlign="center">{guess.spread}</Td>
                                  </>
                                ) : (
                                  <>
                                    <Td fontWeight={500} fontSize="sm">
                                      {i + 1}
                                    </Td>
                                    <Td fontSize="sm">
                                      <VStack justifyContent="center" mb="5">
                                        <Text textAlign="center">
                                          {guess.home_team}
                                        </Text>
                                        <Text textAlign="center">vs</Text>
                                        <Text textAlign="center">
                                          {guess.away_team}
                                        </Text>
                                      </VStack>
                                    </Td>
                                    <Td
                                      textAlign="center"
                                      fontWeight={500}
                                      fontSize="sm"
                                    >
                                      <Badge colorScheme="green">
                                        {guess.status}
                                      </Badge>
                                    </Td>
                                    <Td textAlign="center">Totals</Td>
                                    <Td textAlign="center">
                                      <Text>{guess.totals}</Text>
                                      <Text>{guess.point}</Text>
                                    </Td>
                                  </>
                                )}
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    </GuessesModal>
                  </Td>
                  {currentUser?.role === "admin" ? (
                    <Td>
                      <Button
                        as="a"
                        variant="solid"
                        colorScheme="orange"
                        //eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        href={`mailto:${allUsers[bet.id]?.email}?subject=${
                          //eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                          allUsers[bet.id]?.name
                        }%20%Bets%20%this%20%&body=${`
                      ${bet.guesses.map((game: any, i: number) => {
                        return `game ${i + 1}: ${game.status}`;
                      })}
                      `}`}
                        size="sm"
                      >
                        Send Email
                      </Button>
                    </Td>
                  ) : null}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  ) : null;
}
