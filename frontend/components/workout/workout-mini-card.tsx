import Link from "next/link";
import { Workout } from "../../features/workoutSlice";
import { DotsVerticalIcon } from "@heroicons/react/solid";

interface Props {
  workout: Workout;
}
const WorkoutMiniCard = ({ workout }: Props) => {
  return (
    <Link href={`/workouts/${workout.id}`}>
      <div className="shadow-lg m-3">
        <div className="flex grow w-full p-1">
          <div className="bg-dark w-12 h-12 mr-3"></div>
          <div className="grow">
            {workout.name}
            <br />
            [X] Exercises
          </div>
          <DotsVerticalIcon className="self-center h-4 text-black" />
        </div>
      </div>
    </Link>
  );
};

export default WorkoutMiniCard;
