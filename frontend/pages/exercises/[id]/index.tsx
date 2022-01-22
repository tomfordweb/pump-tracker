import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageHeader from "../../../components/page-header";
import { selectToken } from "../../../features/auth/authSlice";
import {
  getExerciseById,
  selectExerciseById,
} from "../../../features/exerciseSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";

const Exercise = () => {
  const router = useRouter();
  const state = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { id } = router.query;
  const exerciseId = parseInt(id as string);
  const exercise = selectExerciseById(state, exerciseId);
  const token = selectToken(state);

  const updateExerciseApi = () =>
    dispatch(getExerciseById({ exercise: exerciseId, token: token }));

  useEffect(() => {
    updateExerciseApi();
  }, [exerciseId]);

  return exercise ? (
    <section>
      <PageHeader
        title={`Exercise: ${exercise.name}`}
        rightContent={<Link href={`/exercises/${exercise.id}/edit`}>Edit</Link>}
      />
    </section>
  ) : null;
};

export default Exercise;
