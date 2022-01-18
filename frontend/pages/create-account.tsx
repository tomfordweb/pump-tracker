import { NextPage } from "next";
import { useAppDispatch } from "../hooks";
import { useRouter } from "next/router";
import { createAccount, loginToAccount } from "../features/auth/authSlice";
import { TokenCreate, UserCreate } from "../features/auth/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";

const CreateAccount: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
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
                router.push("/dashboard");
              });
            });
        }}
      >
        <Form id="CreateAccountPage">
          <div>
            <label className="block" htmlFor="username">
              Username
            </label>
            <Field
              type="text"
              id="username"
              className="block"
              name="username"
              placeholder="Username"
            />
            <span className="block text-error">
              <ErrorMessage name="username" />
            </span>
          </div>
          <div>
            <label className="block" htmlFor="email">
              Email
            </label>
            <Field id="email" name="email" type="email" placeholder="Email" />
            <span className="block text-error">
              <ErrorMessage name="email" />
            </span>
          </div>
          <div>
            <label className="block" htmlFor="password1">
              Password
            </label>
            <Field
              id="password1"
              className="block"
              name="password1"
              type="password"
              placeholder="Password"
            />
          </div>
          <div>
            <label className="block" htmlFor="password2">
              Password Confirmation
            </label>
            <Field
              id="password2"
              className="block"
              name="password2"
              type="password"
              placeholder="Password Confirmation"
            />
          </div>
          <div>
            <button type="submit" className="btn bg-dark text-white">
              Create Account
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default CreateAccount;
