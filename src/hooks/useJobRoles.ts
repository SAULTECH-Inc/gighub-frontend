import { useMemo } from "react";
import { Option } from "../utils/types";
import { JobRoles } from "../utils/dumm.ts";

export const useJobRoles = (): Option[] => useMemo(() => JobRoles, []);
