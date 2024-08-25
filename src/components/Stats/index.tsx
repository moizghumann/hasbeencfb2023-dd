import { VStack } from "@chakra-ui/react";
import CurrentPicks from "./CurrentPicks";
import PreviousWeekStats from "./PreviousWeekStats";

function CStats() {
  return (
    <VStack w="full" spacing="4">
      <CurrentPicks />
      <PreviousWeekStats />
    </VStack>
  );
}

export default CStats;
