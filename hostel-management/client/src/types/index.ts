// User types
export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: 'chiefWarden' | 'warden' | 'student';
  hostelId?: string;
  token: string;
}

// Hostel types
export interface Hostel {
  _id: string;
  name: string;
  code: string;
  type: 'boys' | 'girls';
  wardenEmail: string;
  wardenName: string;
  wardenMessage: string;
  wardenPhoto?: string;
  about: string;
  staffMembers?: StaffMember[];
  facilities?: Facility[];
  messMenu?: MessMenu[];
  sliderImages?: Image[];
  galleryImages?: Image[];
  messImages?: Image[];
}

// Staff member types
export interface StaffMember {
  _id?: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  photo?: string;
}

// Facility types
export interface Facility {
  _id?: string;
  name: string;
  description?: string;
  icon?: string;
}

// Image types
export interface Image {
  _id?: string;
  url: string;
  caption?: string;
  publicId?: string;
}

// Mess menu types
export interface MessMenu {
  _id?: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: string;
  lunch: string;
  dinner: string;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
} 