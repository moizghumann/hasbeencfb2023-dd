import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Badge,
} from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../slices/store";

type Bet = {
  gameId: string;
  status: string;
  team?: string;
  type: string; // "Spread" or "totals"
  spread?: number;
  totals?: string;
  point?: number;
  home_team?: string;
  away_team?: string;
};

type BetsByWeek = {
  [key: string]: Bet[];
};

function PreviousWeekStats() {
  const { currentUser } = useSelector((state: RootState) => state.app);
  const [bets, setBets] = useState<BetsByWeek>({});

  useEffect(() => {
    if (currentUser) {
      const getBets = async () => {
        const betRef = doc(db, "bets", currentUser.uid);

        // Fetch the document
        const betDoc = await getDoc(betRef);

        if (betDoc.exists()) {
          // Document data
          const betData = betDoc.data() as any;
          setBets(betData);
        }
      };

      getBets();
    }
  }, [currentUser]);

  return (
    <VStack p="6" bg="white" w="full" rounded="2xl" alignItems="flex-start">
      <Heading>Previous week's stats</Heading>
      <Accordion allowToggle w="full">
        {bets &&
          Object.keys(bets)?.map((week: string, weekIndex: number) => (
            <AccordionItem key={weekIndex}>
              <h2>
                <AccordionButton py="4">
                  <Box as="span" flex="1" textAlign="left">
                    {week}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <TableContainer w="full">
                  <Table
                    variant="unstyled"
                    colorScheme="gray"
                    style={{
                      borderCollapse: "separate",
                      borderSpacing: "0 1em",
                    }}
                  >
                    <Thead>
                      <Th>No.</Th>
                      <Th textAlign="center">Game/Team</Th>
                      <Th textAlign="center">Status</Th>
                      <Th textAlign="center">Type</Th>
                      <Th textAlign="center">Locked At</Th>
                    </Thead>
                    <Tbody>
                      {bets[week].map((bet, betIndex) => (
                        <Tr
                          bgColor={"#F3F4F7"}
                          marginBottom={"20px"}
                          border={"2px"}
                          borderColor={"#bdbdbd"}
                          key={betIndex}
                        >
                          {bet.type === "Spread" ? (
                            <>
                              <Td fontWeight={500} fontSize="sm">
                                {betIndex + 1}
                              </Td>
                              <Td textAlign="center" fontSize="sm">
                                {bet.team}
                              </Td>
                              <Td
                                textAlign="center"
                                fontWeight={500}
                                fontSize="sm"
                              >
                                <Badge colorScheme="green">{bet.status}</Badge>
                              </Td>
                              <Td textAlign="center">Spread</Td>
                              <Td textAlign="center">{bet.spread}</Td>
                            </>
                          ) : (
                            <>
                              <Td fontWeight={500} fontSize="sm">
                                {betIndex + 1}
                              </Td>
                              <Td fontSize="sm">
                                <VStack justifyContent="center" mb="5">
                                  <Text textAlign="center">
                                    {bet.home_team}
                                  </Text>
                                  <Text textAlign="center">vs</Text>
                                  <Text textAlign="center">
                                    {bet.away_team}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td
                                textAlign="center"
                                fontWeight={500}
                                fontSize="sm"
                              >
                                <Badge colorScheme="green">{bet.status}</Badge>
                              </Td>
                              <Td textAlign="center">Totals</Td>
                              <Td textAlign="center">
                                <Text>{bet.totals}</Text>
                                <Text>{bet.point}</Text>
                              </Td>
                            </>
                          )}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </VStack>
  );
}

export default PreviousWeekStats;
