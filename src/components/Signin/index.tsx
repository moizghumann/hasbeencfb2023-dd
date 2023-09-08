import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { VStack, Text, Button, Box, Grid, GridItem } from "@chakra-ui/react";
import { useForm, SubmitHandler, DeepMap, FieldError } from "react-hook-form";
import { EMAIL_REGEX } from "../../constants";
import { CInput } from "..";
import { Link } from "react-router-dom";

export type SignInFormType = {
  email: string;
  password: string;
};

export interface CSignInProps {
  onSignInSubmit: (data: SignInFormType) => void;
  errors?: DeepMap<SignInFormType, FieldError>;
  isLoading?: boolean;
}

export default function CSignIn(props: CSignInProps) {
  const [searchParams] = useSearchParams();

  const { onSignInSubmit, isLoading, errors: apiErrors } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFormType>();

  useEffect(() => {
    if (apiErrors) {
      Object.entries(apiErrors).forEach(([name, err]) => {
        if (err) setError(name as keyof SignInFormType, err);
      });
    }
  }, [apiErrors, setError]);

  const submit: SubmitHandler<SignInFormType> = (data) => {
    onSignInSubmit(data);
  };

  return (
    <VStack mt="20">
      <Text as="h1" color="black" fontWeight="semibold" fontSize="3xl" mb="5">
        Login
      </Text>
      <VStack
        as="form"
        onSubmit={handleSubmit(submit)}
        bgColor="#fff"
        px="10"
        py="5"
        rounded="2xl"
        maxW="400px"
        w="full"
        spacing="10"
      >
        <Grid
          w="full"
          onSubmit={handleSubmit(submit)}
          columnGap="10"
          rowGap="4"
        >
          <GridItem>
            <CInput
              {...register(`email`, {
                required: {
                  value: true,
                  message: "email is required!",
                },
                validate: {
                  matchPattern: (v) => {
                    return (
                      EMAIL_REGEX.test(v) ||
                      "Please provide a valid email address"
                    );
                  },
                },
              })}
              error={errors.email}
              label="Email"
              placeholder="jack@gmail.com"
              type="email"
            />
          </GridItem>
          <GridItem>
            <CInput
              {...register(`password`, {
                required: {
                  value: true,
                  message: "password is required!",
                },
              })}
              error={errors.password}
              label="Password"
              placeholder="*******"
              type="password"
            />
          </GridItem>
        </Grid>
        <Box w="full">
          <Button
            colorScheme="blackAlpha"
            bgColor="#100b16"
            _hover={{
              bgColor: "transparent",
              color: "#100b16",
            }}
            _active={{
              bgColor: "#100b16",
              color: "#fff",
            }}
            size="md"
            rounded="full"
            border="1px solid #100b16"
            type="submit"
            isLoading={isLoading}
            w="full"
            mb="3"
          >
            <Text mt="-5px" px="8">
              Login
            </Text>
          </Button>
          <Text textAlign="center">
            Don't have a account?{" "}
            <Text
              as={Link}
              to={`/register${
                searchParams.get("redirect_to")
                  ? // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    `?redirect_to=${searchParams.get("redirect_to")}`
                  : ""
              }`}
              _hover={{
                textDecor: "none",
              }}
              textDecor="underline"
            >
              Register
            </Text>
          </Text>
        </Box>
      </VStack>
    </VStack>
  );
}
