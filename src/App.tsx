import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { onSnapshot } from "firebase/firestore";
import { Dashboard, Register, Signin } from "./containers";
import "./App.css";
import { setBets, setCurrentUser } from "./slices/app";
import { doc, getDoc } from "firebase/firestore";
import { CSpinner } from "./components";
import Guard from "./components/Shared/Guard";
import { RootState } from "./slices/store";

const routes = [
  {
    path: "/",
    Comp: Dashboard,
    guarded: true,
  },
  {
    path: "/signin",
    Comp: Signin,
    guarded: false,
  },
  {
    path: "/register",
    Comp: Register,
    guarded: false,
  },
  // {
  //   path: "/user-bets",
  //   Comp: UserBets,
  //   guarded: false,
  // },
];

function App() {
  const { currentUser } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

        const docSnap = await getDoc(userRef);

        const _user = docSnap.data();

        dispatch(
          setCurrentUser({
            uid: user.uid,
            ..._user,
          })
        );
      } else {
        console.log("user is logged out");
      }
    });

    () => {
      return unsubscribe();
    };
  }, []);

  useEffect(() => {
    let unsubscribe: any = null;
    if (currentUser) {
      const q = doc(db, "bets", currentUser.uid);
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log(querySnapshot.data());
        dispatch(setBets(querySnapshot.data()));
      });
    }

    () => {
      if (unsubscribe) {
        return unsubscribe();
      }
    };
  }, [currentUser]);

  return (
    <Routes>
      {routes.map((route, index) => {
        const comp = () => (
          <Suspense fallback={<CSpinner py="12" w="full" h="100vh" />}>
            <route.Comp />
          </Suspense>
        );
        return (
          <Route
            key={index}
            path={route.path}
            element={
              route.guarded ? (
                <Guard redirectTo="/signin">
                  <>{comp()}</>
                </Guard>
              ) : (
                comp()
              )
            }
          />
        );
      })}
    </Routes>
  );
}

export default App;
