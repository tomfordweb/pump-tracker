import "./App.css";
import { Outlet, Link } from "react-router-dom";

import WorkoutsPage from "./components/WorkoutsPage/WorkoutsPage";

import {
  BrowserRouter,
  useLocation,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import HomePage from "./components/HomePage/HomePage";
import { useAppDispatch, useAppSelector } from "./hooks";
import CreateAccountPage from "./components/CreateAccountPage/CreateAccountPage";
import DashboardPage from "./components/DashboardPage/DashboardPage";
import {
  authHealthcheck,
  logout,
  selectToken,
} from "./features/auth/authSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function PageLayout() {
  const dispatch = useAppDispatch();
  return (
    <div>
      <h1>
        <Link to="/">Pump Tracker</Link>
      </h1>
      <nav style={{ borderBottom: "solid 1px", paddingBottom: "1rem" }}>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/workouts">Workouts</Link>
          </li>
          <li onClick={() => dispatch(logout())}>Logout</li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAppSelector((state) => state.auth);
  let location = useLocation();

  if (!auth.token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const healthcheck = setInterval(() => {
      dispatch(authHealthcheck(token));
    }, 60000);
    return () => clearInterval(healthcheck);
  }, [token]);
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="workouts"
          element={
            <RequireAuth>
              <WorkoutsPage />
            </RequireAuth>
          }
        />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
