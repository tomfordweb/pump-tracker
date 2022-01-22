import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  deleteFromApi,
  generateJwtHeaders,
  getFromApi,
  postJsonToApi,
} from "../../../client";
import Breadcrumb from "../../../components/breadcrumb";
import ExerciseMiniCard from "../../../components/exercise/exercise-mini-card";
import PageHeader from "../../../components/page-header";
import PageTitle from "../../../components/page-title";
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

const WorkoutPlan = () => {
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
    <section>
      <PageHeader
        title={`${plan.name}`}
        rightContent={<Link href={`/plans/${plan.id}/edit`}>Edit</Link>}
      />
    </section>
  ) : null;
};

export default WorkoutPlan;
