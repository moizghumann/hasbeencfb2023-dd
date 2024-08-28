import { chakra, Flex, HStack, Text, Box, Button } from "@chakra-ui/react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import Profile from "./ProfileMenu";

import { RootState } from "../../../slices/store";
import { setBets, setCurrentUser } from "../../../slices/app";
import myImage from "../../../assets/fire.svg";

interface User {
  uid: string;
  email: string;
  name: string;
  points?: number;
  role?: string;
}

const Header = () => {
  const dispatch = useDispatch();
  const currUser: User | any  | null = auth?.currentUser;
  const navigate = useNavigate();

  const { currentUser } = useSelector((state: RootState) => state.app);

  const onLogout = async () => {
    await signOut(auth);
    dispatch(setCurrentUser(null));
    dispatch(setBets({}));
    navigate("/signin");
  };

  return (
    <React.Fragment>
      <chakra.header
        bg="#fff"
        w="full"
        px={{
          base: 5,
          sm: 10,
        }}
        shadow="sm"
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Box paddingY={4}>
            <Text fontSize={30}>🏈</Text>
          </Box>

          <HStack spacing={3} alignItems="center">
            {currUser ? (
              <HStack>
                <Button as={Link} to="/stats" colorScheme="orange">
                  Your Stats
                </Button>
                <Box pos="relative">
                  <img src={myImage} width={30} height={30} />
                  <Text
                    pos="absolute"
                    top="-8px"
                    right="-8px"
                    bg="#FF9F1C"
                    w="20px"
                    h="20px"
                    fontSize="sm"
                    rounded="full"
                    display="grid"
                    placeContent="center"
                  >
                    {currUser?.points ? currUser?.points : 0}
                  </Text>
                </Box>
              </HStack>
            ) : null}
            <Profile onLogout={onLogout} currentUser={currentUser} />
          </HStack>
        </Flex>
      </chakra.header>
    </React.Fragment>
  );
};

export default Header;
