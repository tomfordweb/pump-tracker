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
import WorkoutMiniCard from "../../components/workout/workout-mini-card";
import PageHeader from "../../components/page-header";
import {
  getAllWorkoutPlans,
  selectWorkoutPlans,
} from "../../features/planSlice";

const Plans = () => {
  const dispatch = useAppDispatch();
  const store = useAppSelector((state) => state);
  const token = selectToken(store);
  const plans = selectWorkoutPlans(store);
  useEffect(() => {
    dispatch(getAllWorkoutPlans({ token }));
  }, [token]);
  return (
    <div>
      <PageHeader title="Exercise Plans" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <div key={plan.id} className="cursor-pointer">
            <Link href={`/plans/${plan.id}`}>{plan.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
