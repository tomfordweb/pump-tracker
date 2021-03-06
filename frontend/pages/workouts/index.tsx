import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Link from "next/link";
import { getAllWorkouts, selectWorkouts } from "../../features/workoutSlice";
import { selectToken } from "../../features/auth/authSlice";
import WorkoutMiniCard from "../../components/workout/workout-mini-card";
import PageHeader from "../../components/page-header";

const Workouts = () => {
  const dispatch = useAppDispatch();
  const store = useAppSelector((state) => state);
  const token = selectToken(store);
  const workouts = selectWorkouts(store);
  useEffect(() => {
    dispatch(getAllWorkouts({ token }));
  }, [token]);
  return (
    <div>
      <PageHeader
        title="Workouts List"
        rightContent={<Link href="/workouts/create">Create New</Link>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {workouts.map((workout) => (
          <div key={workout.id} className="cursor-pointer">
            <Link href={`/workouts/${workout.id}`}>
              <div>
                <WorkoutMiniCard key={workout.id} workout={workout} />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workouts;
