import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  deleteFromApi,
  generateJwtHeaders,
  getFromApi,
  postJsonToApi,
} from "../../../client";
import ExerciseForm from "../../../components/exercise/exercise-form";
import WorkoutExerciseSelector from "../../../components/workout/workout-exercise-selector";
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

    await promise
      .then((data) => data.json())
      .then((response) => updateWorkoutApi());
  };

  useEffect(() => {
    updateWorkoutApi();
  }, []);

  return workout ? (
    <div>
      <h1>Workout: {workout.name}</h1>
      <WorkoutExerciseSelector
        exerciseClicked={(props) => handleExerciseClick(props)}
        exercises={workout.exercises}
      />
      <ExerciseForm
        onSubmit={(createdExercise) =>
          postJsonToApi(
            `/workouts/${workout.id}/exercises/${createdExercise.id}`,
            {},
            generateJwtHeaders(token)
          ).then(() => updateWorkoutApi())
        }
      />
    </div>
  ) : null;
};

export default Workout;
