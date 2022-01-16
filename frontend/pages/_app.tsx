import "../styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../store";
import { Provider } from "react-redux";
import { DefaultLayout } from "../components/layout";
import { useAppSelector, useAppDispatch } from "../hooks";
import { authHealthcheck } from "../features/auth/authSlice";
import { useEffect } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import Login from "./login";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <CookiesProvider>
        <DefaultLayout>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </DefaultLayout>
      </CookiesProvider>
    </Provider>
  );
}

function AuthProvider({ children }: { children: JSX.Element }) {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const [cookies, setCookie, removeCookie] = useCookies(["app-jwt"]);

  useEffect(() => {
    setCookie("app-jwt", token);
    const healthcheck = setInterval(() => {
      dispatch(authHealthcheck(token));
    }, 5000);
    return () => clearInterval(healthcheck);
  }, [token]);

  useEffect(() => {
    const authJwt = cookies["app-jwt"];
    if (authJwt && !token) {
      dispatch(authHealthcheck(authJwt));
    }
  }, []);

  let auth = useAppSelector((state) => state.auth);

  if (!auth.token) {
    return <Login />;
  }
  return children;
}

export default MyApp;
