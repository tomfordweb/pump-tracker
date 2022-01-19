import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { AppHttpError, generateJwtHeaders, postJsonToApi } from "../../client";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useRouter } from "next/router";
import { createNewWorkout, Workout } from "../../features/workoutSlice";

interface MyFormValues {
  name: string;
  description: string;
  is_public: boolean;
}
interface Props {
  onSubmit: (data) => {};
}
const ExerciseForm = ({ onSubmit }: Props) => {
  const router = useRouter();
  const initialValues: MyFormValues = {
    is_public: false,
    name: "",
    description: "",
  };
  const token = useAppSelector((state) => state.auth.token);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        postJsonToApi("/exercises", values, generateJwtHeaders(token))
          .then((data) => data.json())
          .then((data) => onSubmit && onSubmit(data));
      }}
    >
      <Form>
        <div>
          <label htmlFor="name" className="block">
            Exercise Name
          </label>
          <Field
            id="name"
            type="text"
            name="name"
            className="block mb-3"
            placeholder="Workout Name"
          />
        </div>
        <button className="btn bg-dark text-white" type="submit">
          Submit
        </button>
        {error && <div>{error}</div>}
      </Form>
    </Formik>
  );
};

export default ExerciseForm;
