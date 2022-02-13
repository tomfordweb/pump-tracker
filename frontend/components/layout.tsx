import { logout } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import Link from "next/link";

type Props = {
  children: JSX.Element[] | JSX.Element;
};

export const DefaultLayout = (props: Props) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const date = new Date();

  return (
    <div className="px-3">
      <nav className="py-5 flex justify-between">
        <h1>
          <Link href={token ? "/dashboard" : "/"}>Exercise Tracker</Link>
        </h1>
        <ul className="flex">
          <li className="mr-3 hover:text-light">
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li className="mr-3 hover:text-light">
            <Link href="/mesocycles">Mesocycles</Link>
          </li>
          <li className="mr-3 hover:text-light">
            <Link href="/workouts">Workouts</Link>
          </li>
          <li className="hover:text-light">
            <Link href="/exercises">Exercises</Link>
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
      <main className="min-h-screen">{props.children}</main>
      <footer>
        <p>
          &copy;{" "}
          <a href="https://github.com/tomfordweb" target="_blank">
            tomfordweb
          </a>{" "}
          {date.getFullYear()}
        </p>
      </footer>
    </div>
  );
};
