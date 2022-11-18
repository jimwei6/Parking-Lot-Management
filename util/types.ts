export interface profile {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
  pronouns: string;
  gender: string;
  dob: string;
}

export interface vehicle {
  licensePlate: string;
  model: string; 
  height: string; 
  color: string; 
  isElectric: boolean; 
  plugType: string; 
  permits: string[];
}