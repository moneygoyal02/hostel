import mongoose, { Document, Schema } from 'mongoose';

interface IMealItem {
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface IMessMenu extends Document {
  hostelId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  menu: {
    monday: IMealItem;
    tuesday: IMealItem;
    wednesday: IMealItem;
    thursday: IMealItem;
    friday: IMealItem;
    saturday: IMealItem;
    sunday: IMealItem;
  };
}

const mealItemSchema = new Schema<IMealItem>({
  breakfast: { type: String, required: true },
  lunch: { type: String, required: true },
  snacks: { type: String, required: true },
  dinner: { type: String, required: true }
}, { _id: false });

const messMenuSchema = new Schema<IMessMenu>(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true
    },
    menu: {
      monday: { type: mealItemSchema, required: true },
      tuesday: { type: mealItemSchema, required: true },
      wednesday: { type: mealItemSchema, required: true },
      thursday: { type: mealItemSchema, required: true },
      friday: { type: mealItemSchema, required: true },
      saturday: { type: mealItemSchema, required: true },
      sunday: { type: mealItemSchema, required: true }
    }
  },
  {
    timestamps: true
  }
);

// Create a compound index for hostelId, month, and year to ensure uniqueness
messMenuSchema.index({ hostelId: 1, month: 1, year: 1 }, { unique: true });

const MessMenu = mongoose.model<IMessMenu>('MessMenu', messMenuSchema);

export default MessMenu; 