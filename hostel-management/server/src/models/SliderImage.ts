import mongoose, { Document, Schema } from 'mongoose';

export interface ISliderImage extends Document {
  url: string;
  caption?: string;
  order: number;
  publicId: string; // Cloudinary public ID
}

const sliderImageSchema = new Schema<ISliderImage>(
  {
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String
    },
    order: {
      type: Number,
      required: true,
      default: 0
    },
    publicId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const SliderImage = mongoose.model<ISliderImage>('SliderImage', sliderImageSchema);

export default SliderImage; 