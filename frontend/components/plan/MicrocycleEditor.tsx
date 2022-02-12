import { XIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { selectWorkoutById, Workout } from "../../features/workoutSlice";
import WorkoutAutocomplete from "../workout/workout-autocomplete";
import WorkoutMiniCard from "../workout/workout-mini-card";

interface Props {
  workouts: Workout[];
}
const MicrocycleEditor = ({ workouts }: Props) => {
  const [microcycle, setMicrocycle] = useState<
    Array<{ sessionNumber: number; workoutId: number }>
  >([]);
  const [microcycleLength, setMicrocycleLength] = useState(7);
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
      if (sessionIndexes.length >= microcycleLength) {
        return;
      }
      if (sessionIndexes.length > sessionCount) {
      }

      setSessionIndexes([...sessionIndexes, day]);
    }
    setSessionCount(sessionIndexes.length);
  };

  const removeFromMicrocycle = (sessionNumber: number, workoutId: number) => {
    console.log(microcycle, sessionNumber, workoutId);
    setMicrocycle(
      microcycle.filter(
        (m) => !(m.sessionNumber === sessionNumber && m.workoutId === workoutId)
      )
    );
  };
  const addToMicrocycle = (sessionNumber: number, workoutId: number) => {
    setMicrocycle([...microcycle, { sessionNumber, workoutId }]);
  };

  console.log(microcycle);
  return (
    <section>
      <header className="flex flex-wrap">
        <h1 className="w-full">Microcycle editor</h1>
        <div>
          <label className="block">Microcyle Length (days)</label>
          <input
            type="number"
            value={microcycleLength}
            onChange={(e) =>
              setMicrocycleLength(parseInt(e.target.value || ""))
            }
          />
        </div>
      </header>
      <article>
        <p>
          In the given microcycle length, select your workout and rest day
          schedule
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {Array.from(Array(microcycleLength || 1).keys()).map((m) => {
            const microcycleCurrentWorkouts = microcycle
              .filter((l) => l.sessionNumber === m)
              .map(
                (h) =>
                  workouts.filter((workout) => workout.id === h.workoutId)[0]
              );

            const microcycleWorkoutKeys = microcycleCurrentWorkouts.map(
              (l) => l.id
            );

            const isRestDay =
              microcycle.filter((l) => l.sessionNumber === m).length === 0;

            return (
              <div
                key={m}
                className={[
                  microcycle.filter((l) => l.sessionNumber === m).length > 0
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
                  <div className="flex items-center relative">
                    <WorkoutMiniCard
                      onClick={(e) => console.log(e)}
                      workout={workout}
                    />
                    <XIcon
                      className="text-error w-5 h-5 absolute top-0 right-0"
                      onClick={() => removeFromMicrocycle(m, workout.id)}
                    />
                  </div>
                ))}
                <div>
                  <strong className="mt-3 block">Add a new Workout</strong>
                  <WorkoutAutocomplete
                    selectWorkout={(workout) => addToMicrocycle(m, workout)}
                    workouts={workouts.filter(
                      (w) => !microcycleWorkoutKeys.includes(w.id)
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
};

export default MicrocycleEditor;
