import { useState } from "react";
import { Container, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { CRegister } from "../../components";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, setDoc, doc } from "firebase/firestore";

import { RegisterFormType, CRegisterProps } from "../../components/Register";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState<CRegisterProps["errors"]>();

  const onRegisterSubmit = async (data: RegisterFormType) => {
    try {
      setIsLoading(true);
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const usersRef = collection(db, "users");

      await setDoc(doc(usersRef, user.user.uid), {
        name: data.name,
        email: data.email,
      });

      console.log("user siginin", user.user.uid);

      navigate("/");

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      const errorCode: string = error.code;
      const errorMessage = error.message;

      switch (errorCode) {
        case "auth/email-already-in-use": {
          setErrors({
            password: {
              type: "validate",
            },
            email: {
              type: "validate",
              message: "Email already in use!",
            },
            name: {
              type: "validate",
            },
          });
          break;
        }
        default:
          console.log(errorMessage);
      }

      console.log(errorCode, errorMessage);
    }
  };

  return (
    <Box minH="100vh">
      <Container>
        <CRegister
          isLoading={isLoading}
          errors={errors}
          onRegisterSubmit={onRegisterSubmit}
        />
      </Container>
    </Box>
  );
}
