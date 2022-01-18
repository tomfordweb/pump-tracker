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
import { useRouter } from "next/router";

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

/**
 * This is really bad and I hate it but nest middleware doesn't seem
 * to want to do what i want.
 *
 * it is good enough for now.
 */
function AuthProvider({ children }: { children: JSX.Element }) {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["app-jwt"]);

  useEffect(() => {
    setCookie("app-jwt", token);
    const healthcheck = setInterval(() => {
      dispatch(authHealthcheck(token));
    }, 30000);
    return () => clearInterval(healthcheck);
  }, [token]);

  useEffect(() => {
    const authJwt = cookies["app-jwt"];
    if (authJwt && !token) {
      dispatch(authHealthcheck(authJwt));
    }
  }, []);

  let auth = useAppSelector((state) => state.auth);

  const privateRoutes = ["/dashboard", "/workouts"];
  if (!auth.token && privateRoutes.includes(router.pathname)) {
    return (
      <div data-test-id="please-authenticate">
        <h1>To view this page, please login</h1>
        <Login />
      </div>
    );
  }
  return children;
}

export default MyApp;
