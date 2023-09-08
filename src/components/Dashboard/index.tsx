import {
  Box,
  Text,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  BoxProps,
} from "@chakra-ui/react";
import { BsCheckLg } from "react-icons/bs";
import { CSpinner } from "..";
import moment from "moment";

interface CustomCheckbox extends BoxProps {
  disabled?: boolean;
  isSelected: boolean;
  limitExceed: boolean;
}

const CustomCheckbox = ({
  isSelected,
  disabled,
  limitExceed,
  ...otherProps
}: CustomCheckbox) => {
  return (
    <Box
      w="35px"
      h="35px"
      bg={isSelected ? "#011627" : disabled || limitExceed ? "#d9d9d9" : ""}
      border={
        disabled || limitExceed ? "2px solid #d9d9d9" : "2px solid #011627"
      }
      rounded="lg"
      cursor="pointer"
      display="grid"
      placeContent="center"
      pointerEvents={(disabled || limitExceed) && !isSelected ? "none" : "all"}
      {...otherProps}
    >
      {isSelected ? <BsCheckLg color="#FF9F1C" size="30px" /> : null}
    </Box>
  );
};

export interface IMatchObject {
  id: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: {
    key: string;
    title: string;
    last_update: string;
    markets: {
      key: string;
      last_update: string;
      outcomes: {
        name: string;
        price: number;
        point: number;
      }[];
    }[];
  }[];
}

interface CDashboardProps {
  data?: IMatchObject[];
  isLoading: boolean;
  onSetBet: (bet: {
    gameId: string;
    status: string;
    team?: string;
    type: string;
    spread?: number;
    totals?: string;
    point?: number;
  }) => void;
  bets: {
    gameId: string;
    status: string;
    team?: string;
    type: string;
    spread?: number;
    totals?: string;
    point?: number;
  }[];
  removeBet: (gameId: string, type: string) => void;
  isSubmittedForCurrentWeek: boolean;
}

export default function CDashboard(props: CDashboardProps) {
  const {
    data,
    isLoading,
    bets,
    onSetBet,
    removeBet,
    isSubmittedForCurrentWeek,
  } = props;

  return (
    <Box w="full" maxW={{ base: "full", md: "full" }} mx="auto">
      <Stack direction={{ base: "column", md: "row" }} gap="5" h="full">
        <Box
          w={{ base: "full", md: "full" }}
          bgColor="#fff"
          color="brand.primary"
          px="5"
          py="3"
          rounded="lg"
        >
          <Text fontSize="3xl" fontWeight={700} mb="2">
            Matches
          </Text>
          <Box maxH="75vh" overflow="auto">
            <TableContainer>
              <Table
                variant="unstyled"
                colorScheme="gray"
                style={{ borderCollapse: "separate", borderSpacing: "0 1em" }}
              >
                <Thead>
                  <Tr bgColor="#F3F4F7">
                    <Th fontSize="base" textAlign="center">
                      Date
                    </Th>
                    <Th fontSize="base" textAlign="center">
                      Team
                    </Th>
                    <Th fontSize="base" textAlign="center">
                      Spread
                    </Th>
                    <Th fontSize="base" textAlign="center">
                      O/U
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data
                    ? data.map((sport) => {
                        if (
                          moment(sport.commence_time).format("dddd") !==
                          "Saturday"
                        ) {
                          return null;
                        }

                        return (
                          <Tr key={sport.id} bgColor="#F3F4F7">
                            <Td
                              textAlign="center"
                              fontSize="base"
                              lineHeight="8"
                            >
                              <Text>
                                {moment(sport.commence_time).format(
                                  "dddd MMM, YYYY HH:mm:A"
                                )}
                              </Text>
                            </Td>
                            <Td>
                              <VStack align="center">
                                <HStack>
                                  {/* <Image src={team1Src} width={"20px"} /> */}
                                  <Text color="#A0A8B1">
                                    {
                                      sport.bookmakers[0]?.markets[0]
                                        .outcomes[0].name
                                    }
                                  </Text>
                                </HStack>
                                <Text color="#A0A8B1">vs</Text>
                                <HStack>
                                  {/* <Image src={team2Src} width={"20px"} /> */}
                                  <Text color="#A0A8B1">
                                    {
                                      sport.bookmakers[0]?.markets[0]
                                        .outcomes[1].name
                                    }
                                  </Text>
                                </HStack>
                              </VStack>
                            </Td>

                            {/* ---------------------- */}
                            <Td>
                              <HStack justifyContent="center" mb="5">
                                {sport.bookmakers[0]?.markets[0] ? (
                                  <>
                                    <Box bgColor="#FF9F1C" p="2" rounded="lg">
                                      {
                                        sport.bookmakers[0]?.markets[0]
                                          ?.outcomes[0].point
                                      }
                                    </Box>
                                    <CustomCheckbox
                                      pointerEvents={
                                        isSubmittedForCurrentWeek
                                          ? "none"
                                          : "all"
                                      }
                                      onClick={() => {
                                        if (
                                          bets.some((bet) => {
                                            return (
                                              bet.team ===
                                              sport.bookmakers[0]?.markets[0]
                                                .outcomes[0].name
                                            );
                                          })
                                        ) {
                                          removeBet(sport.id, "Spread");
                                        } else {
                                          onSetBet({
                                            gameId: sport.id,
                                            status: "in-progress",
                                            team: sport.bookmakers[0]
                                              ?.markets[0].outcomes[0].name,
                                            type: "Spread",
                                            spread:
                                              sport.bookmakers[0]?.markets[0]
                                                .outcomes[0].point,
                                          });
                                        }
                                      }}
                                      isSelected={bets.some((bet) => {
                                        return (
                                          bet.team ===
                                          sport.bookmakers[0]?.markets[0]
                                            .outcomes[0].name
                                        );
                                      })}
                                      disabled={bets.some((bet) => {
                                        return (
                                          bet.team ===
                                          sport.bookmakers[0]?.markets[0]
                                            .outcomes[1].name
                                        );
                                      })}
                                      limitExceed={bets.length === 3}
                                    />
                                  </>
                                ) : null}
                              </HStack>
                              <HStack justifyContent="center">
                                {sport.bookmakers[0]?.markets[0] ? (
                                  <>
                                    <Box bgColor="#FF9F1C" p="2" rounded="lg">
                                      {
                                        sport.bookmakers[0]?.markets[0]
                                          ?.outcomes[1].point
                                      }
                                    </Box>
                                    <CustomCheckbox
                                      pointerEvents={
                                        isSubmittedForCurrentWeek
                                          ? "none"
                                          : "all"
                                      }
                                      onClick={() => {
                                        if (
                                          bets.some((bet) => {
                                            return (
                                              bet.team ===
                                              sport.bookmakers[0]?.markets[0]
                                                .outcomes[1].name
                                            );
                                          })
                                        ) {
                                          removeBet(sport.id, "spread");
                                        } else {
                                          onSetBet({
                                            gameId: sport.id,
                                            status: "in-progress",
                                            team: sport.bookmakers[0]
                                              ?.markets[0].outcomes[1].name,
                                            type: "spread",
                                            spread:
                                              sport.bookmakers[0]?.markets[0]
                                                .outcomes[1].point,
                                          });
                                        }
                                      }}
                                      isSelected={bets.some((bet) => {
                                        return (
                                          bet.team ===
                                          sport.bookmakers[0]?.markets[0]
                                            .outcomes[1].name
                                        );
                                      })}
                                      disabled={bets.some((bet) => {
                                        return (
                                          bet.team ===
                                          sport.bookmakers[0]?.markets[0]
                                            .outcomes[0].name
                                        );
                                      })}
                                      limitExceed={bets.length === 3}
                                    />
                                  </>
                                ) : null}
                              </HStack>
                            </Td>

                            {/* ----------------------------- */}
                            <Td>
                              <HStack justifyContent="center" mb="4">
                                {sport.bookmakers[0]?.markets[1] ? (
                                  <>
                                    <Box bgColor="#FF9F1C" p="2" rounded="lg">
                                      {
                                        sport.bookmakers[0]?.markets[1]
                                          ?.outcomes[0].point
                                      }
                                    </Box>
                                    <CustomCheckbox
                                      pointerEvents={
                                        isSubmittedForCurrentWeek
                                          ? "none"
                                          : "all"
                                      }
                                      onClick={() => {
                                        if (
                                          bets.some((bet) => {
                                            return (
                                              bet.gameId === sport.id &&
                                              bet.totals ===
                                                sport.bookmakers[0]?.markets[1]
                                                  ?.outcomes[0].name
                                            );
                                          })
                                        ) {
                                          removeBet(sport.id, "totals");
                                        } else {
                                          onSetBet({
                                            gameId: sport.id,
                                            status: "in-progress",
                                            type: "totals",
                                            totals:
                                              sport.bookmakers[0]?.markets[1]
                                                ?.outcomes[0].name,
                                            point:
                                              sport.bookmakers[0]?.markets[1]
                                                ?.outcomes[0].point,
                                          });
                                        }
                                      }}
                                      isSelected={bets.some((bet) => {
                                        return (
                                          bet.gameId === sport.id &&
                                          bet.totals ===
                                            sport.bookmakers[0]?.markets[1]
                                              ?.outcomes[0].name
                                        );
                                      })}
                                      disabled={bets.some((bet) => {
                                        return (
                                          bet.gameId === sport.id &&
                                          bet.totals ===
                                            sport.bookmakers[0]?.markets[1]
                                              ?.outcomes[1].name
                                        );
                                      })}
                                      limitExceed={bets.length === 3}
                                    />
                                  </>
                                ) : null}
                              </HStack>
                              <HStack justifyContent="center">
                                {sport.bookmakers[0]?.markets[1] ? (
                                  <>
                                    <Box bgColor="#FF9F1C" p="2" rounded="lg">
                                      {
                                        sport.bookmakers[0]?.markets[1]
                                          ?.outcomes[1].point
                                      }
                                    </Box>
                                    <CustomCheckbox
                                      pointerEvents={
                                        isSubmittedForCurrentWeek
                                          ? "none"
                                          : "all"
                                      }
                                      onClick={() => {
                                        if (
                                          bets.some((bet) => {
                                            return (
                                              bet.gameId === sport.id &&
                                              bet.totals ===
                                                sport.bookmakers[0]?.markets[1]
                                                  ?.outcomes[1].name
                                            );
                                          })
                                        ) {
                                          removeBet(sport.id, "totals");
                                        } else {
                                          onSetBet({
                                            gameId: sport.id,
                                            status: "in-progress",
                                            type: "totals",
                                            totals:
                                              sport.bookmakers[0]?.markets[1]
                                                ?.outcomes[1].name,
                                            point:
                                              sport.bookmakers[0]?.markets[1]
                                                ?.outcomes[1].point,
                                          });
                                        }
                                      }}
                                      isSelected={bets.some((bet) => {
                                        return (
                                          bet.gameId === sport.id &&
                                          bet.totals ===
                                            sport.bookmakers[0]?.markets[1]
                                              ?.outcomes[1].name
                                        );
                                      })}
                                      disabled={bets.some((bet) => {
                                        return (
                                          bet.gameId === sport.id &&
                                          bet.totals ===
                                            sport.bookmakers[0]?.markets[1]
                                              ?.outcomes[0].name
                                        );
                                      })}
                                      limitExceed={bets.length === 3}
                                    />
                                  </>
                                ) : null}
                              </HStack>
                            </Td>
                          </Tr>
                        );
                      })
                    : null}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          {isLoading ? (
            <Box my="10">
              <CSpinner />
            </Box>
          ) : null}
        </Box>
      </Stack>
    </Box>
  );
}
