import { useEffect, useState } from "react";
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
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const now = new Date();
    const saturdayTime = new Date();
    saturdayTime.setUTCHours(17, 0, 0); // 11 am CDT is 16:30 UTC
    saturdayTime.setDate(saturdayTime.getDate() + (6 - saturdayTime.getDay())); // Find the next Saturday

    const twentyFourHoursLater = new Date(saturdayTime);
    twentyFourHoursLater.setHours(twentyFourHoursLater.getHours() + 24);

    if (now >= saturdayTime && now < twentyFourHoursLater) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, []);

  return (
    <Box
      {...otherProps}
      w="35px"
      h="35px"
      bg={
        isSelected
          ? "#011627"
          : isDisabled || disabled || limitExceed
          ? "#d9d9d9"
          : ""
      }
      border={
        isDisabled || disabled || limitExceed
          ? "2px solid #d9d9d9"
          : "2px solid #011627"
      }
      rounded="lg"
      cursor="pointer"
      display="grid"
      placeContent="center"
      pointerEvents={
        isSelected || isDisabled || limitExceed || disabled ? "none" : "all"
      }
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
    home_team?: string;
    away_team?: string;
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
  const { data, isLoading, bets, onSetBet, removeBet } = props;

  return (
    <Box w="full" maxW={{ base: "full", md: "full" }} mx="auto">
      <Stack direction={{ base: "column", md: "row" }} gap="5" h="full">
        <Box
          w={{ base: "full", md: "full" }}
          bgColor="#fff"
          color="brand.primary"
          px="5"
          py="3"
          rounded="xl"
          overflowY={"auto"}
        >
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} mb="2">
            Matches
          </Text>
          <Box>
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
                        // Get the current date and time
                        const currentDate = moment();

                        // Check if the given date falls on a Saturday of the current week
                        const givenDate = moment(sport.commence_time);
                        const isCurrentWeekSaturday =
                          givenDate.isoWeekday() === 6 &&
                          givenDate.isSame(currentDate, "week");

                        if (!isCurrentWeekSaturday) {
                          return null;
                        }

                        return (
                          <Tr key={sport.id} bgColor="#F3F4F7">
                            <Td
                              textAlign="center"
                              fontSize="base"
                              lineHeight="8"
                            >
                              <Text
                                width={"90%"}
                                whiteSpace={"normal"}
                                opacity={"65%"}
                              >
                                {moment(sport.commence_time).format(
                                  "DD/MM/YYYY dddd MMM HH:mm A"
                                )}
                              </Text>
                            </Td>
                            <Td>
                              <VStack align="center">
                                <HStack>
                                  {/* <Image src={team1Src} width={"20px"} /> */}
                                  <Text
                                    opacity={"70%"}
                                    fontWeight={
                                      sport.home_team ===
                                      sport.bookmakers[0]?.markets[0]
                                        .outcomes[0].name
                                        ? "bold"
                                        : "medium"
                                    }
                                  >
                                    {sport.away_team ===
                                    sport.bookmakers[0]?.markets[0].outcomes[0]
                                      .name
                                      ? sport.away_team
                                      : sport.home_team}{" "}
                                    {sport.home_team ===
                                    sport.bookmakers[0]?.markets[0].outcomes[0]
                                      .name
                                      ? "(H)"
                                      : "(A)"}
                                  </Text>
                                </HStack>
                                <Text opacity={"70%"}>vs</Text>
                                <HStack>
                                  {/* <Image src={team2Src} width={"20px"} /> */}
                                  <Text
                                    opacity={"70%"}
                                    fontWeight={
                                      sport.home_team ===
                                      sport.bookmakers[0]?.markets[0]
                                        .outcomes[1].name
                                        ? "bold"
                                        : "medium"
                                    }
                                  >
                                    {sport.home_team ===
                                    sport.bookmakers[0]?.markets[0].outcomes[1]
                                      .name
                                      ? sport.home_team
                                      : sport.away_team}{" "}
                                    {sport.home_team ===
                                    sport.bookmakers[0]?.markets[0].outcomes[1]
                                      .name
                                      ? "(H)"
                                      : "(A)"}
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
                                            type: "Spread",
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
                                            home_team: sport.home_team,
                                            away_team: sport.away_team,
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
                                            home_team: sport.home_team,
                                            away_team: sport.away_team,
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
