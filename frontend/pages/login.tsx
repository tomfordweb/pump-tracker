import type { NextPage } from "next";
import { Formik, Form, Field } from "formik";
import Link from "next/link";
import { useAppDispatch } from "../hooks";
import { useRouter } from "next/router";
import { loginToAccount } from "../features/auth/authSlice";

const Login: NextPage = () => {
  const initialValues: LoginFormValues = { username: "", password: "" };
  const dispatch = useAppDispatch();
  const router = useRouter();

  const dipatchLogin = async (data: TokenCreate) => {
    await dispatch(loginToAccount(data)).unwrap();
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          dipatchLogin(values).then(() => router.push("/dashboard"));
        }}
      >
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field id="username" name="username" placeholder="Username" />
          <Field
            id="password"
            name="password"
            type="password"
            placeholder="Password"
          />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
      <p>
        <Link href="/create-account">Create New Account</Link>
      </p>
    </div>
  );
};

export default Login;
