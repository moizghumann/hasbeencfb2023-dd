import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
  Text,
  Box,
  VStack
} from "@chakra-ui/react";
import person from '../../../assets/icons8-person-94.png'
import { FaPowerOff } from "react-icons/fa";

interface ProfileProps {
  onLogout: () => void;
  currentUser: {
    name: string;
    email: string;
  } | null;
}

export default function Profile(props: ProfileProps) {
  const { onLogout, currentUser } = props;
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        variant="unstyled"
        icon={
          <HStack>
            <Box padding={1} bgColor={'#22668D'} borderRadius={10}>
            <img src={person} width={30} height={30}/>
            </Box>
            
          </HStack>
        }
      />

      <MenuList rounded="3px">
        {/* <MenuItem
          py="1"
          _hover={{
            color: "brand.primary",
          }}
        >
          <Text as={Link} to="/user-bets" mt="-6px" fontWeight={600} w="full">
            Current Bets
          </Text>
        </MenuItem> */}
        <MenuItem
          py="1"
          _hover={{
            color: "brand.primary",
          }}
        >
          <VStack rowGap={1}>
          <Text>{currentUser?.name}</Text>
          <HStack onClick={onLogout} w="full" border={'solid'} borderWidth={2} px={2} py={1} borderRadius={'lg'} mt={2}>

            <FaPowerOff />
            
            <Text py={2} fontWeight={600} >
              Log out
            </Text>
          </HStack>
          </VStack>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
