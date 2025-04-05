import mongoose, { Document, Schema } from 'mongoose';

// Image interface
export interface IImage extends Document {
  url: string;
  caption?: string;
  order: number;
  publicId?: string; // For Cloudinary reference
}

// Staff member interface
export interface IStaffMember extends Document {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  photo?: string;
}

// Array of staff members with id lookup method
export interface IStaffMemberArray extends Array<IStaffMember> {
  id(id: string): IStaffMember | null;
  pull(query: any): void;
}

// Mess menu interface
export interface IMessMenu extends Document {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

// Array of mess menu items with id lookup method
export interface IMessMenuArray extends Array<IMessMenu> {
  id(id: string): IMessMenu | null;
  pull(query: any): void;
}

// Facility interface
export interface IFacility extends Document {
  name: string;
  description?: string;
  icon?: string;
}

// Array of facilities with id lookup method
export interface IFacilityArray extends Array<IFacility> {
  id(id: string): IFacility | null;
  pull(query: any): void;
}

// Array of images with id lookup method
export interface IImageArray extends Array<IImage> {
  id(id: string): IImage | null;
  pull(query: any): void;
}

// Hostel interface
export interface IHostel extends Document {
  name: string;
  code: string;
  type: 'boys' | 'girls';
  about: string;
  wardenId: mongoose.Types.ObjectId;
  wardenEmail: string;
  wardenName: string;
  wardenMessage: string;
  wardenPhoto?: string;
  facilities: IFacilityArray;
  sliderImages: IImageArray;
  messImages: IImageArray;
  galleryImages: IImageArray;
  messMenu: IMessMenuArray;
  staff: IStaffMemberArray;
  createdAt: Date;
  updatedAt: Date;
}

// Image Schema
const ImageSchema = new Schema<IImage>({
  url: {
    type: String,
    required: true
  },
  caption: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  publicId: {
    type: String
  }
});

// Staff Member Schema
const StaffMemberSchema = new Schema<IStaffMember>({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  photo: {
    type: String
  }
});

// Mess Menu Schema
const MessMenuSchema = new Schema<IMessMenu>({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  breakfast: {
    type: String,
    required: true
  },
  lunch: {
    type: String,
    required: true
  },
  snacks: {
    type: String,
    required: true
  },
  dinner: {
    type: String,
    required: true
  }
});

// Facility Schema
const FacilitySchema = new Schema<IFacility>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  icon: {
    type: String
  }
});

// Hostel Schema
const HostelSchema = new Schema<IHostel>(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      required: true,
      enum: ['boys', 'girls']
    },
    about: {
      type: String,
      required: true
    },
    wardenId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wardenEmail: {
      type: String,
      required: true
    },
    wardenName: {
      type: String,
      required: true
    },
    wardenMessage: {
      type: String,
      required: true
    },
    wardenPhoto: {
      type: String
    },
    facilities: [FacilitySchema],
    sliderImages: [ImageSchema],
    messImages: [ImageSchema],
    galleryImages: [ImageSchema],
    messMenu: [MessMenuSchema],
    staff: [StaffMemberSchema]
  },
  {
    timestamps: true
  }
);

const Hostel = mongoose.model<IHostel>('Hostel', HostelSchema);

export default Hostel; 