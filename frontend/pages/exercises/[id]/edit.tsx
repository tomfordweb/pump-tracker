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
  ExerciseCreate,
  getExerciseById,
  selectExerciseById,
} from "../../../features/exerciseSlice";
import {
  getWorkoutById,
  selectWorkoutById,
} from "../../../features/workoutSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";

const ExerciseEdit = () => {
  const router = useRouter();
  const state = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { id } = router.query;
  const exerciseId = parseInt(id as string);
  const exercise = selectExerciseById(state, exerciseId);
  const token = selectToken(state);

  const updateExerciseApi = () =>
    dispatch(getExerciseById({ exercise: exerciseId, token: token }));

  const handleExerciseClick = async (props: {
    exercise: number;
    active: boolean;
  }) => {
    const url = `/exercises/${exercise.id}/exercises/${props.exercise}`;
    const promise = props.active
      ? postJsonToApi(url, {}, generateJwtHeaders(token))
      : deleteFromApi(url, generateJwtHeaders(token));

    await promise
      .then((data) => data.json())
      .then((response) => updateExerciseApi());
  };

  const handleFormSubmit = (exerciseCreate: ExerciseCreate) => {
    // postJsonToApi(
    //   `/workouts/${workout.id}/exercises/${createdExercise.id}`,
    //   {},
    //   generateJwtHeaders(token)
    // ).then(() => updateWorkoutApi());
  };

  useEffect(() => {
    updateExerciseApi();
  }, [exerciseId]);

  return exercise ? (
    <div>
      <PageHeader title={`Edit Exercise: ${exercise.name}`} />
      <section>
        <ExerciseForm
          onSubmit={(createdExercise) => handleFormSubmit(createdExercise)}
        />
      </section>
    </div>
  ) : null;
};

export default ExerciseEdit;
