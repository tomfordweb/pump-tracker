import { logout } from "../features/auth/authSlice";
import { useAppDispatch } from "../hooks";
import Link from "next/link";

type Props = {
  children: JSX.Element[] | JSX.Element;
};

export const DefaultLayout = (props: Props) => {
  const dispatch = useAppDispatch();
  return (
    <div>
      <nav>
        <h1>Exercise Tracker</h1>
        <ul>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/workouts">Workouts</Link>
          </li>
          <li onClick={() => dispatch(logout())}>Logout</li>
        </ul>
      </nav>
      {props.children}
    </div>
  );
};
