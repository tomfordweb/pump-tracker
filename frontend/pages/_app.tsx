import "../styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../store";
import { Provider } from "react-redux";
import { DefaultLayout } from "../components/layout";
import { useAppSelector, useAppDispatch } from "../hooks";
import { authHealthcheck } from "../features/auth/authSlice";
import { useEffect } from "react";
import Login from "./login";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <DefaultLayout>
        <RequireAuth>
          <Component {...pageProps} />
        </RequireAuth>
      </DefaultLayout>
    </Provider>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const healthcheck = setInterval(() => {
      dispatch(authHealthcheck(token));
    }, 60000);
    return () => clearInterval(healthcheck);
  }, [token]);
  let auth = useAppSelector((state) => state.auth);

  if (!auth.token) {
    return <Login />;
  }

  return children;
}
export default MyApp;
