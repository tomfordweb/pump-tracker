import { XIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { Mesocycle, MicrocycleSession } from "../../features/mesocycleSlice";
import { Workout } from "../../features/workoutSlice";
import WorkoutAutocomplete from "../workout/workout-autocomplete";
import WorkoutMiniCard from "../workout/workout-mini-card";

interface Props {
  workouts: Workout[];
  plan: Mesocycle;
  onAddSession?: (data: MicrocycleSession) => void;
  onRemoveSession?: (data: MicrocycleSession) => void;
}

const MicrocycleEditor = ({
  onAddSession,
  onRemoveSession,
  plan,
  workouts,
}: Props) => {
  const [sessionCount, setSessionCount] = useState(3);

  const [sessionIndexes, setSessionIndexes] = useState<Array<number>>([]);

  const graphItemReducer = (day: number) => {
    const exists = sessionIndexes.includes(day);

    if (exists) {
      setSessionIndexes(
        sessionIndexes.filter((c) => {
          return c !== day;
        })
      );
    } else {
      if (sessionIndexes.length >= plan.length_in_days) {
        return;
      }
      if (sessionIndexes.length > sessionCount) {
      }

      setSessionIndexes([...sessionIndexes, day]);
    }
    setSessionCount(sessionIndexes.length);
  };

  const removeFromMicrocycle = (
    microcycle_index: number,
    workout_id: number
  ) => {
    if (onRemoveSession) {
      onRemoveSession({ microcycle_index, workout_id, microcycle_id: 1 });
    }
  };

  const addToMicrocycle = (microcycle_index: number, workout_id: number) => {
    if (onAddSession) {
      onAddSession({ microcycle_index, workout_id, microcycle_id: 1 });
    }
  };

  return (
    <section>
      {onAddSession && onRemoveSession && (
        <header className="flex flex-wrap">
          <h1 className="w-full">Microcycle editor</h1>
          <p>
            In the given microcycle length, select your workout and rest day
            schedule
          </p>
        </header>
      )}
      <article>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {plan &&
            Array.from(Array(plan.length_in_days || 1).keys()).map((m) => {
              const microcycleCurrentWorkouts = plan?.sessions
                ? plan.sessions
                    .filter((l) => l.microcycle_index === m)
                    .map(
                      (h) =>
                        workouts.filter(
                          (workout) => workout.id === h.workout_id
                        )[0]
                    )
                : [];

              const microcycleWorkoutKeys =
                microcycleCurrentWorkouts &&
                microcycleCurrentWorkouts.map((l) => l.id);

              const isRestDay =
                plan?.sessions &&
                plan.sessions.filter((l) => l.microcycle_index === m).length ===
                  0;

              return (
                <div
                  key={m}
                  className={[
                    plan?.sessions &&
                    plan.sessions.filter((l) => l.microcycle_index === m)
                      .length > 0
                      ? "bg-light"
                      : "bg-gray",
                    "p-3 border border-dark m-1",
                  ].join(" ")}
                  onClick={() => graphItemReducer(m)}
                >
                  <strong className="text-xl">
                    Day {m + 1}
                    {isRestDay && (
                      <small className="block text-xs">Rest Day</small>
                    )}
                  </strong>
                  {microcycleCurrentWorkouts.map((workout: Workout) => (
                    <div
                      key={workout.id}
                      className="flex items-center relative"
                    >
                      <WorkoutMiniCard
                        onClick={(e) => console.log(e)}
                        workout={workout}
                      />
                      {onRemoveSession && (
                        <XIcon
                          className="text-error w-5 h-5 absolute top-0 right-0"
                          onClick={() => removeFromMicrocycle(m, workout.id)}
                        />
                      )}
                    </div>
                  ))}
                  {onAddSession && (
                    <div>
                      <strong className="mt-3 block">Add a new Workout</strong>
                      <WorkoutAutocomplete
                        selectWorkout={(workout) => addToMicrocycle(m, workout)}
                        workouts={workouts.filter(
                          (w) => !microcycleWorkoutKeys.includes(w.id)
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </article>
    </section>
  );
};

export default MicrocycleEditor;
