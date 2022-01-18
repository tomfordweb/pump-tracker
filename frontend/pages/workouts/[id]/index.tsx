import { useRouter } from "next/router";
import { useEffect } from "react";
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

  useEffect(() => {
    if (!workout) {
      dispatch(getWorkoutById({ workout: workoutId, token: token }));
    }
  }, [workout, workoutId, token]);

  return (
    <div>
      <h1>Workout: {workout.name}</h1>
    </div>
  );
};

export default Workout;
