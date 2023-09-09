import { chakra, Flex, HStack, Text, Box } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import Profile from "./ProfileMenu";
import { Link } from "react-router-dom";
import { RootState } from "../../../slices/store";
import { setCurrentUser } from "../../../slices/app";
import { AiFillFire } from "react-icons/ai";

const Header = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { currentUser } = useSelector((state: RootState) => state.app);

  const onLogout = async () => {
    await signOut(auth);
    dispatch(setCurrentUser(null));
    navigate("/signin");
  };

  return (
    <React.Fragment>
      <chakra.header
        bg="#fff"
        w="full"
        px={{
          base: 2,
          sm: 10,
        }}
        shadow="sm"
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Text
            as={Link}
            to="/"
            color="#000"
            borderTop="2px solid #2DCC70"
            py="5"
          >
            Matches
          </Text>
          <HStack spacing={3} alignItems="center">
            {currentUser ? (
              <Box pos="relative">
                <AiFillFire size="25px" />
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
                  {currentUser.points ? currentUser.points : 0}
                </Text>
              </Box>
            ) : null}
            <Profile onLogout={onLogout} currentUser={currentUser} />
          </HStack>
        </Flex>
      </chakra.header>
    </React.Fragment>
  );
};

export default Header;
