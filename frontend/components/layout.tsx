import { logout } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import Link from "next/link";

type Props = {
  children: JSX.Element[] | JSX.Element;
};

export const DefaultLayout = (props: Props) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  return (
    <div>
      <nav className="flex justify-between">
        <h1>Exercise Tracker</h1>
        <ul className="flex">
          <li className="hover:text-light">
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li className="hover:text-light">
            <Link href="/workouts">Workouts</Link>
          </li>
        </ul>
        <div>
          {token ? (
            <span
              className="mr-3 btn bg-black text-white"
              onClick={() => dispatch(logout())}
            >
              Logout
            </span>
          ) : (
            <div>
              <span className="mr-3 btn bg-black text-white">
                <Link href="/login">Sign In</Link>
              </span>
              <span className="btn bg-dark text-white">
                <Link href="/create-account">Sign Up</Link>
              </span>
            </div>
          )}
        </div>
      </nav>
      <main>{props.children}</main>
    </div>
  );
};
