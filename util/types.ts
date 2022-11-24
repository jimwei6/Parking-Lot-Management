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

export interface spotFilter {
  location: string;
  spotType: string;  // company or vip
  licensePlate: string; //gets is electric, plug type if need charging. Also gets permits they have
  needsCharging: string; 
  duration: number; // duration in minutes 
  accessType: string;
}