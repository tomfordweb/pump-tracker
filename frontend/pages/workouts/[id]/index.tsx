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
  getWorkoutById,
  selectWorkoutById,
} from "../../../features/workoutSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";

const Workout = () => {
  const router = useRouter();
  const state = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { id } = router.query;
  const workoutId = parseInt(id as string);
  const workout = selectWorkoutById(state, workoutId);
  const token = selectToken(state);

  const updateWorkoutApi = () =>
    dispatch(getWorkoutById({ workout: workoutId, token: token }));

  useEffect(() => {
    updateWorkoutApi();
  }, [workoutId]);

  return workout ? (
    <section>
      <PageHeader
        title={`Workout: ${workout.name}`}
        rightContent={<Link href={`/workouts/${workout.id}/edit`}>Edit</Link>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4">
        {workout.exercises &&
          workout.exercises.map((exercise) => (
            <ExerciseMiniCard key={exercise.id} exercise={exercise} />
          ))}
      </div>
      {(!workout.exercises || workout.exercises.length === 0) && (
        <p>There are no exercises for {workout.name}</p>
      )}
    </section>
  ) : null;
};

export default Workout;
