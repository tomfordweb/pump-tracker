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
import { useAppSelector } from "./hooks";

function PageLayout() {
  return (
    <div>
      <h1>Pump Tracker</h1>
      <nav style={{ borderBottom: "solid 1px", paddingBottom: "1rem" }}>
        <Link to="/workouts">Workouts</Link>
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
  // useEffect(() => {
  //   fetch("/api/v1", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((response) => console.log(response));
  // }, []);
  // <div>
  //   <h1>Pump Tracker</h1>
  //   <nav style={{ borderBottom: "solid 1px", paddingBottom: "1rem" }}>
  //     <Link to="/workouts">Workouts</Link>
  //   </nav>
  //   <Outlet />
  // </div>
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
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
