import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageHeader from "../../../components/page-header";
import MicrocycleEditor from "../../../components/microcycle/microcycle-editor";
import { selectToken } from "../../../features/auth/authSlice";
import {
  getWorkoutPlanById,
  selectWorkoutPlanById,
} from "../../../features/mesocycleSlice";
import { getAllWorkouts, selectWorkouts } from "../../../features/workoutSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";

const MesocycleIdIndex = () => {
  const router = useRouter();
  const state = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { id } = router.query;
  const planId = parseInt(id as string);
  const plan = selectWorkoutPlanById(state, planId);
  const workouts = selectWorkouts(state);
  const token = selectToken(state);

  const updateWorkoutPlanApi = () =>
    dispatch(getWorkoutPlanById({ plan: planId, token: token }));

  useEffect(() => {
    dispatch(getAllWorkouts({ token }));
    updateWorkoutPlanApi();
  }, [planId]);

  return plan ? (
    <section>
      <PageHeader
        title={`${plan.name}`}
        rightContent={<Link href={`/mesocycles/${plan.id}/edit`}>Edit</Link>}
      />

      <article>
        <MicrocycleEditor plan={plan} workouts={workouts} />
      </article>
    </section>
  ) : null;
};

export default MesocycleIdIndex;
