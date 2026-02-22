export interface Profile {
  id: string;
  hommat_id: string;
  phone_number: string;
  sex: "male" | "female";
  city: string;
  dob: string;
  age: number;
  existing_conditions: string[];
  created_at: string;
  updated_at: string;
}

export interface SignupProfileInsert {
  id: string;
  phone_number: string;
  sex: "male" | "female";
  city: string;
  dob: string;
  age: number;
  existing_conditions: string[];
}
