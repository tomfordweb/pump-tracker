import { XIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { selectToken } from "../../features/auth/authSlice";
import {
  getWorkoutById,
  selectWorkoutById,
  Workout,
} from "../../features/workoutSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import WorkoutMiniCard from "./workout-mini-card";

interface Props {
  workouts: Workout[];
  selectWorkout: (workoutId: number) => void;
}
const WorkoutAutocomplete = ({ workouts, selectWorkout }: Props) => {
  const [showResultsList, setShowResultsList] = useState(false);
  const [filter, setFilter] = useState("");
  const [highlightedWorkout, setHighlightedWorkout] = useState(0);

  const state = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const token = selectToken(state);

  const highlightedWorkoutDetails = selectWorkoutById(
    state,
    highlightedWorkout
  );

  const filteredResults = workouts
    .filter((workout) => {
      if (filter.length === 0) {
        return true;
      }
      return (
        workout.name
          .toLowerCase()
          .replace(" ", "")
          .indexOf(filter.toLowerCase().replace(" ", "")) > -1
      );
    })
    .map((filteredWorkout) => (
      <div className="border border-dark m-1">
        <WorkoutMiniCard
          active={highlightedWorkout === filteredWorkout.id}
          onClick={(id) => setHighlightedWorkout(id)}
          workout={filteredWorkout}
        />
      </div>
    ));

  useEffect(() => {
    if (!highlightedWorkout) {
      return;
    }
    dispatch(getWorkoutById({ workout: highlightedWorkout, token: token }));
  }, [highlightedWorkout, token]);

  return (
    <div
      onFocus={(e) => {
        setShowResultsList(true);
        if (!showResultsList) {
          return setShowResultsList(true);
        }
        if (e.currentTarget === e.target) {
          console.log("focused self");
        } else {
          console.log("focused child", e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log("focus entered self");
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          setShowResultsList(false);
          setHighlightedWorkout(0);
          console.log("unfocused self");
        } else {
          console.log("unfocused child", e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log("focus left self");
        }
      }}
      className="relative"
    >
      <div className="flex items-center">
        <input
          type="text"
          value={filter}
          className="w-40"
          onChange={(e) => setFilter(e.target.value)}
        />
        {filter.length > 0 ||
          (showResultsList && (
            <XIcon
              className="text-error w-5 h-5"
              onClick={() => {
                setFilter("");
                setShowResultsList(false);
                setHighlightedWorkout(0);
              }}
            />
          ))}
      </div>
      <div className="flex absolute mt-1 w-full z-50">
        {showResultsList && (
          <div className="max-h-64 h-auto w-64 overflow-auto bg-white mr-3">
            {filteredResults}
          </div>
        )}
        {highlightedWorkoutDetails && (
          <div
            className="w-96 right-0 border border-dark bg-light p-3"
            onClick={() => {
              selectWorkout(highlightedWorkoutDetails.id);
              setFilter("");
              setShowResultsList(false);
              setHighlightedWorkout(0);
            }}
          >
            <strong className="block">Workout Details</strong>
            <span className="block mb-3">{highlightedWorkoutDetails.name}</span>
            <strong className="block">Exercise List</strong>
            <ul>
              {highlightedWorkoutDetails.exercises &&
                highlightedWorkoutDetails.exercises.map((exercise) => (
                  <li key={exercise.id}>{exercise.name}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default WorkoutAutocomplete;
