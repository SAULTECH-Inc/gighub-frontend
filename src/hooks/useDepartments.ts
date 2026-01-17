import { useMemo } from "react";
import { Option } from "../utils/types";

import { DepartmentType } from "../utils/constants.ts";

export const useDepartments = (): Option[] => useMemo(() => DepartmentType, []);
