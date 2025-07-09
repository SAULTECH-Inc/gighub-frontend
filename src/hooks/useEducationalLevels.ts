import { useMemo } from "react";
import { Option } from "../utils/types";

const educationLevels = [
  { label: "No Formal Education", value: "none" },
  { label: "Primary School", value: "primary-school" },
  { label: "Middle School / Junior High", value: "middle-school" },
  { label: "High School / Secondary School", value: "high-school" },
  { label: "Vocational Training", value: "vocational" },
  { label: "Associate Degree", value: "associate" },
  { label: "Bachelor's Degree", value: "bachelor" },
  { label: "Postgraduate Diploma", value: "postgraduate-diploma" },
  { label: "Master's Degree", value: "master" },
  { label: "MBA (Master of Business Administration)", value: "mba" },
  { label: "Doctoral Degree (Ph.D.)", value: "phd" },
  { label: "Doctor of Medicine (M.D.)", value: "md" },
  { label: "Juris Doctor (J.D.)", value: "jd" },
  { label: "Postdoctoral Studies", value: "postdoc" },
  { label: "Professional Certification", value: "certification" },
  { label: "Other", value: "other" },
];


export const useEducationalLevel = (): Option[] => useMemo(() => educationLevels, []);
