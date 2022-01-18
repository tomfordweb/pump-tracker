import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { AppHttpError, generateJwtHeaders, postJsonToApi } from "../../client";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  createNewWorkout,
  getAllWorkouts,
  selectWorkouts,
  Workout,
} from "../../features/workoutSlice";
import { selectToken } from "../../features/auth/authSlice";
import { NextPage } from "next";
import WorkoutMiniCard from "../../components/workout/workout-mini-card";

const Workouts = () => {
  const dispatch = useAppDispatch();
  const store = useAppSelector((state) => state);
  const token = selectToken(store);
  const workouts = selectWorkouts(store);
  useEffect(() => {
    dispatch(getAllWorkouts({ token }));
  }, [token]);
  return (
    <div>
      <h1>Workouts List</h1>
      <div className="flex flex-wrap">
        {workouts.map((workout) => (
          <div key={workout.id} className="w-1/4 mb-3">
            <WorkoutMiniCard workout={workout} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workouts;
