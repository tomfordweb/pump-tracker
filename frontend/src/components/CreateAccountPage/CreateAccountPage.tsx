import React from "react";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
  ErrorMessage,
} from "formik";
import { useAppDispatch } from "../../hooks";
import {
  createAccount,
  loginToAccount,
  TokenCreate,
  UserCreate,
} from "../../features/auth/authSlice";

import { useNavigate } from "react-router-dom";

const CreateAccountPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initialValues: UserCreate = {
    username: "test",
    email: "test@test.com",
    password1: "test",
    password2: "test",
  };

  const createNewAccount = async (data: UserCreate) => {
    await dispatch(createAccount(data)).unwrap();
  };

  const loginWithNewAccount = async (data: TokenCreate) => {
    await dispatch(loginToAccount(data))
      .unwrap()
      .then((data) => console.log(data));
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          createNewAccount(values)
            .catch((error) => actions.setErrors(error.field_errors))
            .then(() => {
              loginWithNewAccount({
                username: values.username,
                password: values.password1,
              }).then(() => {
                navigate("/dashboard");
              });
            });
          // alert(JSON.stringify(values, null, 2));
          // actions.setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => {
          console.log(errors);
          return (
            <Form>
              <Field id="username" name="username" placeholder="Username" />
              <ErrorMessage name="username" />
              <Field id="email" name="email" type="email" placeholder="Email" />
              <ErrorMessage name="email" />
              <Field
                id="password1"
                name="password1"
                type="password"
                placeholder="Password"
              />
              <Field
                id="password2"
                name="password2"
                type="password"
                placeholder="Password Confirmation"
              />
              <button type="submit">Submit</button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateAccountPage;
