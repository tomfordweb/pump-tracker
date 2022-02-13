import { useEffect, useState } from "react";
import { generateJwtHeaders, getFromApi, postJsonToApi } from "../../client";
import { selectToken } from "../../features/auth/authSlice";
import { Exercise } from "../../features/workoutSlice";
import { useAppSelector } from "../../hooks";
import ExerciseMiniCard from "../exercise/exercise-mini-card";
import Grid from "../grid";

interface Props {
  exercises: Exercise[];
  exerciseClicked: (props: { exercise: number; active: boolean }) => {};
}
const WorkoutExerciseSelector = ({ exercises, exerciseClicked }: Props) => {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const token = useAppSelector((state) => selectToken(state));

  useEffect(() => {
    getFromApi("/exercises", generateJwtHeaders(token))
      .then((data) => data.json())
      .then((data) => setAllExercises(data));
  }, [exercises]);

  const activeExerciseKeys =
    exercises && exercises.map((exercise) => exercise.id);

  const isActiveExercise = (exerciseId: number) =>
    activeExerciseKeys && activeExerciseKeys.includes(exerciseId);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      {allExercises.map((exercise) => (
        <ExerciseMiniCard
          key={exercise.id}
          exercise={exercise}
          isActive={isActiveExercise(exercise.id)}
          exerciseClicked={exerciseClicked}
        />
      ))}
    </div>
  );
};

export default WorkoutExerciseSelector;
