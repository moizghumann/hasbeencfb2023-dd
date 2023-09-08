import React from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";

interface GuardedRouteProps {
  children: JSX.Element | React.ReactNode;
  redirectTo: string;
}

export default function Guarded(props: GuardedRouteProps) {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>();
  const { children, redirectTo } = props;

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        console.log("user is logged out");
      }
    });

    () => {
      return unsubscribe();
    };
  }, []);

  console.log(isLoggedIn);

  return isLoggedIn !== undefined && isLoggedIn === true ? (
    <div id="GChildren">{children}</div>
  ) : isLoggedIn !== undefined && isLoggedIn === false ? (
    <div id="redirectComp">
      <Navigate to={redirectTo} />
    </div>
  ) : null;
}
