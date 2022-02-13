import { useRouter } from "next/router";
import { useEffect } from "react";
import PageHeader from "../../../components/page-header";
import { selectToken } from "../../../features/auth/authSlice";
import {
  addWorkoutSessionToMicrocycle,
  getWorkoutPlanById,
  MicrocycleSession,
  removeWorkoutSessionFromMicrocycle,
  selectWorkoutPlanById,
} from "../../../features/mesocycleSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import MicrocycleEditor from "../../../components/plan/MicrocycleEditor";
import { getAllWorkouts, selectWorkouts } from "../../../features/workoutSlice";
import { Field, Form, Formik } from "formik";

const WorkoutPlanEdit = () => {
  const router = useRouter();
  const state = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { id } = router.query;
  const planId = parseInt(id as string);
  const plan = selectWorkoutPlanById(state, planId);
  const token = selectToken(state);
  const workouts = selectWorkouts(state);

  const updateWorkoutPlanApi = () =>
    dispatch(getWorkoutPlanById({ plan: planId, token: token }));

  const removeSessionFromMicrocycle = (props: MicrocycleSession) => {
    dispatch(
      removeWorkoutSessionFromMicrocycle({ token: token, session: props })
    );
  };

  const addSessionToMicrocycle = (props: MicrocycleSession) => {
    dispatch(addWorkoutSessionToMicrocycle({ token: token, session: props }));
  };

  useEffect(() => {
    updateWorkoutPlanApi();
  }, [planId]);

  useEffect(() => {
    dispatch(getAllWorkouts({ token }));
  }, [token]);

  return plan ? (
    <div>
      <section>
        <PageHeader title={`Edit Mesocycle: ${plan.name}`} />
      </section>
      <section className="mb-5">
        <Formik initialValues={plan} onSubmit={(values, actions) => {}}>
          <Form>
            <div>
              <label htmlFor="name" className="block">
                Mesocycle name
              </label>
              <Field
                id="name"
                type="text"
                name="name"
                className="block mb-3"
                placeholder="The ultimate full body workout"
              />
            </div>
            <div>
              <label htmlFor="length_in_days" className="block">
                Length in days
              </label>
              <Field
                id="length_in_days"
                type="number"
                name="length_in_days"
                className="block mb-3"
              />
            </div>
            <button className="btn bg-dark text-white" type="submit">
              Submit
            </button>
          </Form>
        </Formik>
      </section>
      <section>
        <MicrocycleEditor
          plan={plan}
          onAddSession={(data) => addSessionToMicrocycle(data)}
          onRemoveSession={(data) => removeSessionFromMicrocycle(data)}
          workouts={workouts}
        />
      </section>
    </div>
  ) : null;
};

export default WorkoutPlanEdit;
