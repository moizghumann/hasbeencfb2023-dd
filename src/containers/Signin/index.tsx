// import { useState } from "react";
import { useState } from "react";
import { Container, Box } from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { CSignin } from "../../components";
// import { useSignIn } from "../../hooks";
import { CSignInProps, SignInFormType } from "../../components/Signin";
import { setCurrentUser } from "../../slices/app";
import { doc, getDoc } from "firebase/firestore";
// import { setCurrentUser } from "../../slices/app";
// import { ERROR_CODES } from "../../constants";
// import { RootState } from "../../slices/store";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  //   const [searchParams] = useSearchParams();

  // const { currentUser } = useSelector((state: RootState) => state.app);

  const navigate = useNavigate();

  const [errors, setErrors] = useState<CSignInProps["errors"]>();

  //   const { mutate, isLoading } = useSignIn();

  const onSignInSubmit = async (data: SignInFormType) => {
    try {
      setIsLoading(true);
      const user = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const userRef = doc(db, "users", user.user.uid);

      const docSnap = await getDoc(userRef);

      const _user = docSnap.data();

      dispatch(
        setCurrentUser({
          ..._user,
        })
      );

      setIsLoading(false);

      navigate("/");
    } catch (error: any) {
      setIsLoading(false);
      const errorCode: string = error.code;
      const errorMessage = error.message;

      switch (errorCode) {
        case "auth/user-not-found": {
          setErrors({
            password: {
              type: "validate",
            },
            email: {
              type: "validate",
              message: "User not found!",
            },
          });
          break;
        }
        case "auth/wrong-password": {
          setErrors({
            password: {
              type: "validate",
              message: "Email or Password is wrong!",
            },
            email: {
              type: "validate",
            },
          });
          break;
        }
        default:
          console.log(errorMessage);
      }
    }
  };

  return (
    <Box minH="100vh">
      <Container>
        <CSignin
          onSignInSubmit={onSignInSubmit}
          isLoading={isLoading}
          errors={errors}
        />
      </Container>
    </Box>
  );
}
