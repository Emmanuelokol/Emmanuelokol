export interface Profile {
  id: string;
  city: string;
  sex: "male" | "female";
  age: number;
  marital_status: "single" | "married" | "divorced" | "widowed" | "other";
  has_family: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}
