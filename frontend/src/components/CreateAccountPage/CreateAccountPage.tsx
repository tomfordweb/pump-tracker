import React from "react";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from "formik";
import { useAppDispatch } from "../../hooks";
import { createAccount, UserCreate } from "../../features/auth/authSlice";

const CreateAccountPage = () => {
  const initialValues: UserCreate = {
    username: "",
    email: "test@test.com",
    password1: "",
    password2: "",
  };

  const create = async (data: UserCreate) => {
    console.log(data);
    // await useAppDispatch(createAccount(data)).unwrap();
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          create(values);
          // console.log({ values, actions });
          // alert(JSON.stringify(values, null, 2));
          // actions.setSubmitting(false);
        }}
      >
        <Form>
          <Field id="username" name="username" placeholder="Username" />
          <Field id="email" name="email" type="email" placeholder="Email" />
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
      </Formik>
    </div>
  );
};

export default CreateAccountPage;
