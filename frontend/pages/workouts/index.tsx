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
          <label htmlFor="name">Workout Name</label>
          <Field id="name" type="text" name="name" placeholder="Workout Name" />
          <label htmlFor="description">Description</label>
          <Field
            id="description"
            name="description"
            placeholder="Workout Description"
          />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
};

export default WorkoutCreateForm;