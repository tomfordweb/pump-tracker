import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Link from "next/link";
import { selectToken } from "../../features/auth/authSlice";
import PageHeader from "../../components/page-header";
import ExerciseMiniCard from "../../components/exercise/exercise-mini-card";
import { getAllExercises, selectExercises } from "../../features/exerciseSlice";

const Exercises = () => {
  const dispatch = useAppDispatch();
  const store = useAppSelector((state) => state);
  const token = selectToken(store);
  const exercises = selectExercises(store);
  useEffect(() => {
    dispatch(getAllExercises({ token }));
  }, [token]);
  return (
    <div>
      <PageHeader title="Exercises List" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="cursor-pointer">
            <Link href={`/exercises/${exercise.id}`}>
              <div>
                <ExerciseMiniCard key={exercise.id} exercise={exercise} />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercises;
