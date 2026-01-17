import React from "react";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  employerNavBarItemMap,
} from "../../utils/constants.ts";
import Schedules from "../employer/Schedules.tsx";
import MainFooter from "../../components/layouts/MainFooter.tsx";

const MySchedules: React.FC = () => {
  return (
    <>
      {USER_TYPE === UserType.EMPLOYER ? (
        <TopNavBar
          navbarItemsMap={employerNavBarItemMap}
          userType={"employer"}
        />
      ) : (
        <TopNavBar
          navbarItemsMap={applicantNavBarItemMap}
          userType={"applicant"}
        />
      )}
      <Schedules />
      <MainFooter />
    </>
  );
};
export default MySchedules;
