import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { AppHttpError } from "../../client";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useRouter } from "next/router";
import {
  createNewMesocycle,
  MesocycleCreate,
} from "../../features/mesocycleSlice";

const ExercisePlanCreate = () => {
  const router = useRouter();
  const initialValues: MesocycleCreate = {
    name: "",
    length_in_days: 7,
    description: "",
  };
  const token = useAppSelector((state) => state.auth.token);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        setError("");
        dispatch(createNewMesocycle({ plan: values, token: token || "" }))
          .unwrap()
          .then((data) => {
            router.push(`/mesocycles/${data.id}`);
          })
          .catch((error: AppHttpError) => setError(error.message));
      }}
    >
      <Form>
        <div>
          <label htmlFor="name" className="block">
            Exercise Plan Name
          </label>
          <Field
            id="name"
            type="text"
            name="name"
            className="block mb-3"
            placeholder="Push Pull Legs"
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
            placeholder="The best meso cycle"
          />
        </div>
        <div>
          <label className="block" htmlFor="length_in_days">
            Rotation Length (days)
          </label>
          <Field
            type="number"
            id="length_in_days"
            name="length_in_days"
            className="block mb-3"
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

export default ExercisePlanCreate;
