import { Schema, model, Document, Types } from 'mongoose';

export interface IDataset extends Document {
  filename: string;
  uploadDate: Date;
  fileType: 'matches' | 'deliveries';
  totalRows: number;
  uploadedBy: Types.ObjectId;
}

const DatasetSchema = new Schema<IDataset>(
  {
    filename: {
      type: String,
      required: [true, 'Dataset filename is required.'],
      trim: true
    },
    fileType: {
      type: String,
      required: [true, 'Dataset file type is required.'],
      enum: {
        values: ['matches', 'deliveries'],
        message: '{VALUE} is not a valid dataset file type.'
      }
    },
    totalRows: {
      type: Number,
      required: [true, 'Dataset total row count is required.'],
      min: [0, 'Row count cannot be negative.']
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader user reference is required.'],
      index: true // Index uploader to accelerate lookup of user file history
    }
  },
  {
    timestamps: { createdAt: 'uploadDate', updatedAt: false }
  }
);

// Compound index to help fetch uploads sorted by upload date
DatasetSchema.index({ uploadedBy: 1, uploadDate: -1 });

export const Dataset = model<IDataset>('Dataset', DatasetSchema);
export default Dataset;
