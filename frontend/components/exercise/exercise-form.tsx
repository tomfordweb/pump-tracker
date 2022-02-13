import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { AppHttpError, generateJwtHeaders, postJsonToApi } from "../../client";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useRouter } from "next/router";
import { createNewWorkout, Workout } from "../../features/workoutSlice";
import {
  createNewExercise,
  Exercise,
  ExerciseCreate,
  updateExercise,
} from "../../features/exerciseSlice";

interface Props {
  onSubmit: (data: ExerciseCreate) => void;
  values?: Exercise;
}
const ExerciseForm = ({ values, onSubmit }: Props) => {
  const initialValues: ExerciseCreate | Exercise = {
    is_public: false,
    avatar_id: "",
    name: "",
    description: "",
  };

  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  return (
    <Formik
      initialValues={values || initialValues}
      onSubmit={(formData, actions) => {
        if (token && values) {
          values.id
            ? dispatch(
                updateExercise({
                  exercise: formData as Exercise,
                  token,
                })
              )
            : dispatch(createNewExercise({ exercise: formData, token }));
        }
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
        <div>
          <label htmlFor="name" className="block">
            Description
          </label>
          <Field
            id="description"
            type="text"
            name="description"
            className="block mb-3"
            placeholder="Description"
          />
        </div>
        <button className="btn bg-dark text-white" type="submit">
          Submit
        </button>
      </Form>
    </Formik>
  );
};

export default ExerciseForm;
