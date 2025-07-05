import { useMemo } from "react";
import { Option } from "../utils/types";
import { skills } from "../utils/dumm.ts";

export const useSkills = (): Option[] => useMemo(() => skills, []);
