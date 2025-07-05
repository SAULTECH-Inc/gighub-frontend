import { useMemo } from "react";
import { Option } from "../utils/types";
import { DepartmentType } from "../utils/DepartmentType.ts";

export const useDepartments = (): Option[] => useMemo(() => DepartmentType, []);
