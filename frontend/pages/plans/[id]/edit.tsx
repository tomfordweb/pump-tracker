import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect } from "react";
import PageHeader from "../../../components/page-header";
import { selectToken } from "../../../features/auth/authSlice";
import {
  getWorkoutPlanById,
  selectWorkoutPlanById,
} from "../../../features/planSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import MicrocycleEditor from "../../../components/plan/MicrocycleEditor";
import { getAllWorkouts, selectWorkouts } from "../../../features/workoutSlice";

const WorkoutPlanEdit = () => {
  const router = useRouter();
  const state = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { id } = router.query;
  const planId = parseInt(id as string);
  const plan = selectWorkoutPlanById(state, planId);
  const token = selectToken(state);
  const workouts = selectWorkouts(state);

  const updateWorkoutPlanApi = () =>
    dispatch(getWorkoutPlanById({ plan: planId, token: token }));

  useEffect(() => {
    updateWorkoutPlanApi();
  }, [planId]);

  useEffect(() => {
    dispatch(getAllWorkouts({ token }));
  }, [token]);

  return plan ? (
    <div>
      <section>
        <PageHeader title={`Edit Plan: ${plan.name}`} />
      </section>
      <section>
        <MicrocycleEditor workouts={workouts} />
      </section>
    </div>
  ) : null;
};

export default WorkoutPlanEdit;
