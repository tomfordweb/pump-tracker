import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { generateJwtHeaders, postJsonToApi } from "../../client";
import { useAppSelector } from "../../hooks";
import { useRouter } from "next/router";

interface MyFormValues {
  name: string;
  description: string;
  is_public: boolean;
}
const WorkoutCreateForm = () => {
  const router = useRouter();
  const initialValues: MyFormValues = {
    is_public: false,
    name: "",
    description: "",
  };
  const token = useAppSelector((state) => state.auth.token);
  const [error, setError] = useState(null);
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          if (!values.is_public) {
            // if a checkbox is not clicked the value will not be set, so do something about that.
            values.is_public = false;
          }
          setError(null);
          postJsonToApi("/workouts", values, generateJwtHeaders(token))
            .then((data) => data.json())
            .then((data) => {
              router.push(`/workouts/${data.id}`);
            })
            .catch((error) => setError(error.message));
        }}
      >
        <Form>
          <div>
            <label htmlFor="name" className="block">
              Workout Name
            </label>
            <Field
              id="name"
              type="text"
              name="name"
              className="block mb-3"
              placeholder="Workout Name"
            />
          </div>
          <div>
            <label className="block" htmlFor="description">
              Description
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              className="block mb-3"
              placeholder="Workout Description"
            />
          </div>
          <div>
            <label className="block" htmlFor="description">
              Public Workout
            </label>
            <Field
              type="checkbox"
              id="public-workout"
              name="is_public"
              className="block mb-3"
            />
          </div>
          <button className="btn bg-dark text-white" type="submit">
            Submit
          </button>
          {error && <div>{error}</div>}
        </Form>
      </Formik>
    </div>
  );
};

export default WorkoutCreateForm;
