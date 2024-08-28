import { useEffect,useState } from "react";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../slices/store";
import { setSelectedBet } from "../../slices/app";
import {  doc,getDoc } from "firebase/firestore";
import { db,auth } from "../../firebase";
function CurrentPicks() {
  const { selectedBets, bets: RBets } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (RBets) {
  //     dispatch(setSelectedBet(Object.values(RBets)[0]));
  //   }
  // }, [RBets]);
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
  useEffect(() => {
    const checkIfSelectedBetsExist = async () => {
      try {
        const currUser = auth?.currentUser;
        if (currUser) {
          // Create a reference to the document for the selected user's bets
          const selectedBetsRef = doc(db, "selectedBets", currUser.uid);
    
          // Fetch the document snapshot from Firestore
          const selectedBetsSnap = await getDoc(selectedBetsRef);
    
          // Check if the document exists
          if (selectedBetsSnap.exists()) {
            // Document exists, retrieve data
            const selectedBetsData = selectedBetsSnap.data();
            setBets(selectedBetsData?.bets);
            dispatch(setSelectedBet(selectedBetsData?.bets));
            // const newFormat = JSON.stringify(selectedBetsData); 
            console.log("Selected bets data from firestore:",selectedBetsData?.bets); 
            // return selectedBetsData; // Return the data if needed
          } else {
            // Document does not exist
            console.log("No selected bets found for the current user.");
            // return null;
          }
        } else {
          console.error("No current user found. Please log in.",currUser);
          // return null;
        }
      } catch (error) {
        console.error("Error fetching selected bets:", error);
        // return null;
      }
    };
    if(selectedBets?.length > 0){ 
      setBets(selectedBets)
    }else{ 
      checkIfSelectedBetsExist()
    }

  },[])
  // const currBetsData = bets.length > 0 ? bets
  return (
    <VStack p="6" bg="white" w="full" rounded="2xl" alignItems="flex-start">
      <Heading>Current week's picks</Heading>
      <Box>
        {bets?.map((bet, index) => (
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
