import type { NextPage } from "next";
import { Formik, Form, Field } from "formik";
import Link from "next/link";
import { useAppDispatch } from "../hooks";
import { useRouter } from "next/router";
import { TokenCreate, loginToAccount } from "../features/auth/authSlice";

interface LoginFormValues {
  username: string;
  password: string;
}
const Login: NextPage = () => {
  const initialValues: LoginFormValues = { username: "", password: "" };
  const dispatch = useAppDispatch();
  const router = useRouter();

  const dipatchLogin = async (data: TokenCreate) => {
    await dispatch(loginToAccount(data))
      .unwrap()
      .then(() => router.push("/dashboard"));
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          dipatchLogin(values);
        }}
      >
        <Form>
          <div>
            <label className="block" htmlFor="username">
              Username
            </label>
            <Field
              type="text"
              className="block mb-3"
              id="username"
              name="username"
            />
          </div>
          <label className="block" htmlFor="password">
            Password
          </label>
          <Field
            id="password"
            name="password"
            type="password"
            className="block mb-3"
            placeholder="Password"
          />
          <button type="submit" className="btn bg-dark text-white">
            Submit
          </button>
        </Form>
      </Formik>
      <p className="bg-blue-500">
        <Link href="/create-account">Create New Account</Link>
      </p>
    </div>
  );
};

export default Login;
