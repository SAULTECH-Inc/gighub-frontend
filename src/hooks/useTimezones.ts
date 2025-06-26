import { useMemo } from "react";
import { Option } from "../utils/types";

export const useTimezones = (): Option[] =>
  useMemo(() => Intl.supportedValuesOf("timeZone").map((tz) => ({
    label: tz,
    value: tz
  })), []);
