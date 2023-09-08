// import { useSelector } from "react-redux";
// import { CSpinner, Layout } from "../../components";
// import { useGetSportsData } from "../Dashboard/queries";
// import {
//   Box,
//   Table,
//   TableContainer,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   VStack,
// } from "@chakra-ui/react";
// import { RootState } from "../../slices/store";
// import { useEffect } from "react";
// import { IMatchObject } from "../../components/Dashboard";

// const findCurrentSpreads = (team: string, data: IMatchObject[]) => {
//   const currentMatch = data.find((_team) => {
//     return _team.away_team === team || _team.home_team === team;
//   });

//   const spreads = currentMatch?.bookmakers[0].markets[0].outcomes.find(
//     (__team) => __team.name === team
//   );

//   return {
//     spreads,
//   };
// };

// const findCurrentTotats = (id: string, data: IMatchObject[]) => {
//   const currentMatch = data.find((_team) => {
//     return _team.id === id;
//   });

//   const totals = currentMatch?.bookmakers[0].markets[1].outcomes[0].point;

//   return {
//     totals,
//     home_team: currentMatch?.home_team,
//     away_team: currentMatch?.away_team,
//   };
// };

// export default function UserBets() {
//   const { currentUser } = useSelector((state: RootState) => state.app);
//   const { data, isLoading: getDataLoading } = useGetSportsData();

//   useEffect(() => {
//     // console.log(data?.data);
//     console.log(
//       data?.data ? findCurrentSpreads("Boise State Broncos", data.data) : "null"
//     );
//   }, [data]);

//   return (
//     <Layout>
//       <Box maxW={{ base: "full", md: "80%" }} mx="auto">
//         <Box
//           // w={{ base: "full", md: "80%" }}
//           w={{ base: "full", md: "full" }}
//           bgColor="#fff"
//           color="brand.primary"
//           px="5"
//           py="3"
//           rounded="lg"
//         >
//           <Text fontSize="3xl" fontWeight={700} mb="2">
//             Current Spreads
//           </Text>
//           <Box maxH="75vh" overflow="auto">
//             <TableContainer>
//               <Table
//                 variant="unstyled"
//                 colorScheme="gray"
//                 style={{ borderCollapse: "separate", borderSpacing: "0 1em" }}
//               >
//                 <Thead>
//                   <Tr bgColor="#F3F4F7">
//                     {/* <Th fontSize="base" textAlign="center">
//                       Date
//                     </Th> */}
//                     <Th fontSize="base" textAlign="center">
//                       Team
//                     </Th>
//                     <Th fontSize="base" textAlign="center">
//                       Spread
//                     </Th>
//                   </Tr>
//                 </Thead>
//                 <Tbody>
//                   {currentUser?.currentGuesses.map((team) => (
//                     <Tr bgColor="#F3F4F7">
//                       <Td textAlign="center" fontSize="base" lineHeight="8">
//                         {team.team}
//                       </Td>
//                       <Td>
//                         <VStack>
//                           {data?.data ? (
//                             findCurrentSpreads(team.team, data?.data).spreads
//                               ?.point ? (
//                               <Box bgColor="#FF9F1C" p="2" rounded="lg">
//                                 {
//                                   findCurrentSpreads(team.team, data?.data)
//                                     .spreads?.point
//                                 }
//                               </Box>
//                             ) : null
//                           ) : null}
//                         </VStack>
//                       </Td>
//                     </Tr>
//                   ))}
//                 </Tbody>
//               </Table>
//             </TableContainer>
//           </Box>

//           {getDataLoading ? (
//             <Box my="10">
//               <CSpinner />
//             </Box>
//           ) : null}
//         </Box>
//         <Box
//           // w={{ base: "full", md: "80%" }}
//           w={{ base: "full", md: "full" }}
//           bgColor="#fff"
//           color="brand.primary"
//           px="5"
//           py="3"
//           rounded="lg"
//         >
//           <Text fontSize="3xl" fontWeight={700} mb="2">
//             Current U/O
//           </Text>
//           <Box maxH="75vh" overflow="auto">
//             <TableContainer>
//               <Table
//                 variant="unstyled"
//                 colorScheme="gray"
//                 style={{ borderCollapse: "separate", borderSpacing: "0 1em" }}
//               >
//                 <Thead>
//                   <Tr bgColor="#F3F4F7">
//                     {/* <Th fontSize="base" textAlign="center">
//                       Date
//                     </Th> */}
//                     <Th fontSize="base" textAlign="center">
//                       Team
//                     </Th>
//                     <Th fontSize="base" textAlign="center">
//                       O/U
//                     </Th>
//                   </Tr>
//                 </Thead>
//                 <Tbody>
//                   {currentUser?.currentTotalsGuesses.map((team) => (
//                     <Tr bgColor="#F3F4F7">
//                       <Td textAlign="center" fontSize="base" lineHeight="8">
//                         {data?.data ? (
//                           findCurrentTotats(team.id, data?.data).home_team ? (
//                             <>
//                               {findCurrentTotats(team.id, data?.data).home_team}
//                               <br />
//                               vs
//                               <br />
//                             </>
//                           ) : null
//                         ) : null}
//                         {data?.data
//                           ? findCurrentTotats(team.id, data?.data).away_team
//                           : null}
//                       </Td>
//                       <Td>
//                         <VStack>
//                           {data?.data ? (
//                             findCurrentTotats(team.id, data?.data)?.totals ? (
//                               <Box bgColor="#FF9F1C" p="2" rounded="lg">
//                                 {findCurrentTotats(team.id, data?.data)?.totals}
//                               </Box>
//                             ) : null
//                           ) : null}
//                         </VStack>
//                       </Td>
//                     </Tr>
//                   ))}
//                 </Tbody>
//               </Table>
//             </TableContainer>
//           </Box>

//           {getDataLoading ? (
//             <Box my="10">
//               <CSpinner />
//             </Box>
//           ) : null}
//         </Box>
//       </Box>
//     </Layout>
//   );
// }
