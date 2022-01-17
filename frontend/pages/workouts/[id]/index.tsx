import { useRouter } from "next/router";

const Workout = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Workout: {id}</h1>
    </div>
  );
};

export default Workout;
