import React from "react";
import { Field, Form, Formik } from "formik";

interface MyFormValues {
  name: string;
  description: string;
}
const WorkoutCreateForm = () => {
  const initialValues: MyFormValues = { name: "", description: "" };
  return (
    <div data-testid="WorkoutCreateForm">
      <div>
        <h1>My Example</h1>
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
            <label htmlFor="name">First Name</label>
            <Field id="name" name="name" placeholder="Workout Name" />
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
    </div>
  );
};

export default WorkoutCreateForm;
