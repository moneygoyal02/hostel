import mongoose, { Document, Schema } from 'mongoose';

export interface IStaff extends Document {
  name: string;
  position: string;
  contactNumber: string;
  hostelId: mongoose.Types.ObjectId;
  joiningDate: Date;
}

const staffSchema = new Schema<IStaff>(
  {
    name: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true
    },
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Staff = mongoose.model<IStaff>('Staff', staffSchema);

export default Staff; 