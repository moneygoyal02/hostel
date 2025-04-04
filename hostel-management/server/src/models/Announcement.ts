import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  createdBy: mongoose.Types.ObjectId;
  hostelId?: mongoose.Types.ObjectId; // Optional if it's a global announcement
  isGlobal: boolean;
  publishDate: Date;
  expiryDate?: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel'
    },
    isGlobal: {
      type: Boolean,
      required: true,
      default: false
    },
    publishDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    expiryDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema);

export default Announcement; 