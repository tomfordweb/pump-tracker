import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  deleteFromApi,
  generateJwtHeaders,
  postJsonToApi,
} from "../../../client";
import ExerciseForm from "../../../components/exercise/exercise-form";
import PageHeader from "../../../components/page-header";
import WorkoutExerciseSelector from "../../../components/workout/workout-exercise-selector";
import { selectToken } from "../../../features/auth/authSlice";
import {
  getWorkoutById,
  selectWorkoutById,
} from "../../../features/workoutSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";

const WorkoutEdit = () => {
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

    await promise
      .then((data) => data.json())
      .then((response) => updateWorkoutApi());
  };

  useEffect(() => {
    updateWorkoutApi();
  }, [workoutId]);

  return workout ? (
    <div>
      <section>
        <PageHeader title={`Edit Workout: ${workout.name}`} />

        <WorkoutExerciseSelector
          exerciseClicked={(props) => handleExerciseClick(props)}
          exercises={workout.exercises}
        />
      </section>
      <section>
        <header>
          <h2>Create a new exercise for {workout.name}</h2>
        </header>
        <ExerciseForm />
      </section>
    </div>
  ) : null;
};

export default WorkoutEdit;
