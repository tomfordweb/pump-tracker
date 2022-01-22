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

  const handleExerciseClick = async (props: {
    exercise: number;
    active: boolean;
  }) => {
    const url = `/workouts/${workout.id}/exercises/${props.exercise}`;
    const promise = props.active
      ? postJsonToApi(url, {}, generateJwtHeaders(token))
      : deleteFromApi(url, generateJwtHeaders(token));

    await promise.then((data) => data.json()).then(() => updateWorkoutApi());
  };

  useEffect(() => {
    updateWorkoutApi();
  }, [workoutId]);

  return workout ? (
    <section>
      <header className="mb-5">
        <Breadcrumb />
        <div className="flex">
          <div className="grow">
            <PageTitle>Workout: {workout.name}</PageTitle>
          </div>
          <div>
            <Link href={`/workouts/${workout.id}/edit`}>Edit</Link>
          </div>
        </div>
      </header>

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
