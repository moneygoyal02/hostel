import mongoose, { Document, Schema } from 'mongoose';

export interface IHostel extends Document {
  name: string;
  type: 'boys' | 'girls';
  wardenId: mongoose.Types.ObjectId;
  wardenEmail: string;
  capacity: number;
  location: string;
}

const hostelSchema = new Schema<IHostel>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ['boys', 'girls'],
      required: true
    },
    wardenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wardenEmail: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Hostel = mongoose.model<IHostel>('Hostel', hostelSchema);

export default Hostel; 