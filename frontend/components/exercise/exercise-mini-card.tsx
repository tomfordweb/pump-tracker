import { useEffect, useState } from "react";
import { generateJwtHeaders, getFromApi, postJsonToApi } from "../../client";
import { selectToken } from "../../features/auth/authSlice";
import { Exercise } from "../../features/workoutSlice";
import { useAppSelector } from "../../hooks";

interface Props {
  exercise: Exercise;
  isActive?: boolean;
  exerciseClicked?: (props: { active: boolean; exercise: number }) => {};
}
const ExerciseMiniCard = ({ exercise, isActive, exerciseClicked }: Props) => {
  return (
    <div
      key={exercise.id}
      onClick={() =>
        exerciseClicked &&
        exerciseClicked({
          exercise: exercise.id,
          active: !isActive,
        })
      }
      className={[
        isActive ? "border-dashed border-2 border-dark" : "",
        "shadow-lg border-gray p-1",
      ].join(" ")}
    >
      {exercise.name}
    </div>
  );
};

export default ExerciseMiniCard;
