import React from "react";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from "formik";
import { Link, useNavigate } from "react-router-dom";
import { loginToAccount, TokenCreate } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../hooks";

interface LoginFormValues {
  username: string;
  password: string;
}
const LoginPage = () => {
  const initialValues: LoginFormValues = { username: "", password: "" };
  const dispatch = useAppDispatch();
  let navigate = useNavigate();

  const dipatchLogin = async (data: TokenCreate) => {
    await dispatch(loginToAccount(data)).unwrap();
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          dipatchLogin(values).then(() => navigate("/dashboard"));
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
        <Link to="/create-account">Create New Account</Link>
      </p>
    </div>
  );
};

export default LoginPage;
