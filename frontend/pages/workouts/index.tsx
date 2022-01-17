import React from "react";
import { Field, Form, Formik } from "formik";

interface MyFormValues {
  name: string;
  description: string;
}
const WorkoutCreateForm = () => {
  const initialValues: MyFormValues = { name: "", description: "" };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          fetch("/api/v1/workouts", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then((json) => json.json())
            .then((data) => console.log(data));
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
          <button className="btn bg-dark text-white" type="submit">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default WorkoutCreateForm;
