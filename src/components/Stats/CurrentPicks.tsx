import { useEffect } from "react";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../slices/store";
import { setSelectedBet } from "../../slices/app";

function CurrentPicks() {
  const { selectedBets, bets: RBets } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (RBets) {
      dispatch(setSelectedBet(Object.values(RBets)[0]));
    }
  }, [RBets]);

  return (
    <VStack p="6" bg="white" w="full" rounded="2xl" alignItems="flex-start">
      <Heading>Current week's picks</Heading>
      <Box>
        {selectedBets?.map((bet, index) => (
          <Text fontSize="2xl" color="gray.500" key={index}>
            {bet.type === "totals"
              ? `${bet.home_team} vs ${bet.away_team}`
              : bet.team}
          </Text>
        ))}
      </Box>
      <Flex w="full" justifyContent="flex-end">
        <Button colorScheme="orange">Submit</Button>
      </Flex>
    </VStack>
  );
}

export default CurrentPicks;
