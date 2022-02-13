import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Link from "next/link";
import { selectToken } from "../../features/auth/authSlice";
import PageHeader from "../../components/page-header";
import {
  getAllMesocycles,
  selectWorkoutPlans,
} from "../../features/mesocycleSlice";

const Plans = () => {
  const dispatch = useAppDispatch();
  const store = useAppSelector((state) => state);
  const token = selectToken(store);
  const plans = selectWorkoutPlans(store);
  useEffect(() => {
    dispatch(getAllMesocycles({ token }));
  }, [token]);
  return (
    <div>
      <PageHeader
        title="Your Mesocycles"
        rightContent={<Link href={`/mesocycles/create`}>Create New</Link>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <div key={plan.id} className="cursor-pointer">
            <Link href={`/mesocycles/${plan.id}`}>{plan.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
