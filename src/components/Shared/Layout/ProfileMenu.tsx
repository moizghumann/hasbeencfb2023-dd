import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
  Text,
} from "@chakra-ui/react";

import { IoPersonCircleSharp } from "react-icons/io5";
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
            <IoPersonCircleSharp fontSize="40px" color="black" />
            <Text>{currentUser?.name}</Text>
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
          <HStack onClick={onLogout} w="full">
            <FaPowerOff />
            <Text mt="-6px" fontWeight={600}>
              Log out
            </Text>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
