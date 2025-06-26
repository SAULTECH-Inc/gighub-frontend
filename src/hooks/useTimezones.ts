import { useMemo } from "react";
import { Option } from "../utils/types";

const TIMEZONES: Option[] = [
  {
    "label": "UTC - Coordinated Universal Time",
    "value": "UTC"
  },
  {
    "label": "GMT - Greenwich Mean Time",
    "value": "GMT"
  },
  {
    "label": "EST - Eastern Standard Time",
    "value": "EST"
  },
  {
    "label": "EDT - Eastern Daylight Time",
    "value": "EDT"
  },
  {
    "label": "CST - Central Standard Time",
    "value": "CST"
  },
  {
    "label": "CDT - Central Daylight Time",
    "value": "CDT"
  },
  {
    "label": "MST - Mountain Standard Time",
    "value": "MST"
  },
  {
    "label": "MDT - Mountain Daylight Time",
    "value": "MDT"
  },
  {
    "label": "PST - Pacific Standard Time",
    "value": "PST"
  },
  {
    "label": "PDT - Pacific Daylight Time",
    "value": "PDT"
  },
  {
    "label": "WAT - West Africa Time",
    "value": "WAT"
  },
  {
    "label": "CAT - Central Africa Time",
    "value": "CAT"
  },
  {
    "label": "EAT - East Africa Time",
    "value": "EAT"
  },
  {
    "label": "IST - India Standard Time",
    "value": "IST"
  },
  {
    "label": "CET - Central European Time",
    "value": "CET"
  },
  {
    "label": "CEST - Central European Summer Time",
    "value": "CEST"
  },
  {
    "label": "EET - Eastern European Time",
    "value": "EET"
  },
  {
    "label": "EEST - Eastern European Summer Time",
    "value": "EEST"
  },
  {
    "label": "JST - Japan Standard Time",
    "value": "JST"
  },
  {
    "label": "KST - Korea Standard Time",
    "value": "KST"
  },
  {
    "label": "AEST - Australian Eastern Standard Time",
    "value": "AEST"
  },
  {
    "label": "AEDT - Australian Eastern Daylight Time",
    "value": "AEDT"
  },
  {
    "label": "ACST - Australian Central Standard Time",
    "value": "ACST"
  },
  {
    "label": "ACDT - Australian Central Daylight Time",
    "value": "ACDT"
  },
  {
    "label": "AWST - Australian Western Standard Time",
    "value": "AWST"
  }
];

export const useTimezones = (): Option[] =>
  useMemo(() => TIMEZONES, []);
