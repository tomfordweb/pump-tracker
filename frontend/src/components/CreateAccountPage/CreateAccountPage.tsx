import { Formik, Form, Field, ErrorMessage } from "formik";
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
    username: "",
    email: "",
    password1: "",
    password2: "",
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
        }}
      >
        <Form id="CreateAccountPage">
          <label htmlFor="username">Username</label>
          <Field id="username" name="username" placeholder="Username" />
          <ErrorMessage name="username" />
          <label htmlFor="email">Email</label>
          <Field id="email" name="email" type="email" placeholder="Email" />
          <ErrorMessage name="email" />
          <label htmlFor="password1">Password</label>
          <Field
            id="password1"
            name="password1"
            type="password"
            placeholder="Password"
          />
          <label htmlFor="password2">Password Confirmation</label>
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
