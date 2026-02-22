console.log("[health-conditions] Module loading...");

/** Common conditions shown as a clickable multi-select list during signup. */
export const HEALTH_CONDITIONS = [
  "Diabetes",
  "High Blood Pressure",
  "Asthma",
  "HIV / AIDS",
  "Sickle Cell Disease",
  "Malaria (recurring)",
  "Tuberculosis",
  "Heart Disease",
  "Epilepsy",
  "Kidney Disease",
  "Hepatitis B",
  "Arthritis",
  "None of the above",
] as const;

export const UGANDA_CITIES = [
  "Kampala",
  "Jinja",
  "Gulu",
  "Mbarara",
  "Lira",
  "Mbale",
  "Masaka",
  "Entebbe",
  "Fort Portal",
  "Soroti",
  "Arua",
  "Hoima",
] as const;
