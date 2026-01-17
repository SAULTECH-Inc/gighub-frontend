import { useMemo } from "react";
import { Option } from "../utils/types";

import { skills } from "../utils/constants.ts";

export const useSkills = (): Option[] => useMemo(() => skills, []);
