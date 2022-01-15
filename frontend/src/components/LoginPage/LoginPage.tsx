import React from "react";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from "formik";
import { Link } from "react-router-dom";

interface LoginFormValues {
  username: string;
  password: string;
}
const LoginPage = () => {
  const initialValues: LoginFormValues = { username: "", password: "" };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          console.log({ values, actions });
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
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
