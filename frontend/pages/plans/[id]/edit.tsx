import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  deleteFromApi,
  generateJwtHeaders,
  getFromApi,
  postJsonToApi,
} from "../../../client";
import ExerciseForm from "../../../components/exercise/exercise-form";
import PageHeader from "../../../components/page-header";
import WorkoutExerciseSelector from "../../../components/workout/workout-exercise-selector";
import { selectToken } from "../../../features/auth/authSlice";
import {
  getWorkoutPlanById,
  selectWorkoutPlanById,
} from "../../../features/planSlice";
import {
  getWorkoutById,
  selectWorkoutById,
} from "../../../features/workoutSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";

const WorkoutPlanEdit = () => {
  const router = useRouter();
  const state = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { id } = router.query;
  const planId = parseInt(id as string);
  const plan = selectWorkoutPlanById(state, planId);
  const token = selectToken(state);

  const updateWorkoutPlanApi = () =>
    dispatch(getWorkoutPlanById({ plan: planId, token: token }));

  useEffect(() => {
    updateWorkoutPlanApi();
  }, [planId]);

  return plan ? (
    <div>
      <section>
        <PageHeader title={`Edit Plan: ${plan.name}`} />
      </section>
      <section></section>
    </div>
  ) : null;
};

export default WorkoutPlanEdit;
