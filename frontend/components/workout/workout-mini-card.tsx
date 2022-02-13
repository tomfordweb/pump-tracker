import { Workout } from "../../features/workoutSlice";

interface Props {
  workout: Workout;
  hideIcon?: boolean;
  onClick?: (workoutId: number) => void;
}
const WorkoutMiniCard = ({ onClick, workout, hideIcon }: Props) => {
  return (
    <div
      className="bg-white w-full mb-1 border border-dark"
      onClick={() => (onClick ? onClick(workout.id) : null)}
    >
      <div className="flex grow p-1">
        {!hideIcon && <div className="bg-dark w-12 h-12 mr-3"></div>}
        <div className="grow">
          {workout.name}
          <br />
          {workout.exercises && workout.exercises.length} Exercises
        </div>
      </div>
    </div>
  );
};

export default WorkoutMiniCard;
