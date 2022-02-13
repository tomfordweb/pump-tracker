import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  deleteFromApi,
  generateJwtHeaders,
  postJsonToApi,
} from "../../../client";
import ExerciseForm from "../../../components/exercise/exercise-form";
import PageHeader from "../../../components/page-header";
import { selectToken } from "../../../features/auth/authSlice";
import {
  ExerciseCreate,
  getExerciseById,
  selectExerciseById,
} from "../../../features/exerciseSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";

const ExerciseEdit = () => {
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
    <div>
      <PageHeader title={`Edit Exercise: ${exercise.name}`} />
      <section>
        <ExerciseForm values={exercise} />
      </section>
    </div>
  ) : null;
};

export default ExerciseEdit;
