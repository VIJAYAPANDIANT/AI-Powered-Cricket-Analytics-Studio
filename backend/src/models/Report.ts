import { Schema, model, Document, Types } from 'mongoose';

export interface IReport extends Document {
  reportName: string;
  generatedDate: Date;
  generatedBy: Types.ObjectId;
  filters: Record<string, any>;
  fileUrl: string;
}

const ReportSchema = new Schema<IReport>(
  {
    reportName: {
      type: String,
      required: [true, 'Report name is required.'],
      trim: true
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Generator user reference is required.'],
      index: true // Index user references to fetch user generation history
    },
    filters: {
      type: Map,
      of: String,
      default: {}
    },
    fileUrl: {
      type: String,
      required: [true, 'Report file URL download reference is required.'],
      trim: true
    }
  },
  {
    timestamps: { createdAt: 'generatedDate', updatedAt: false }
  }
);

// Compound index to speed up reports history sorting
ReportSchema.index({ generatedBy: 1, generatedDate: -1 });

export const Report = model<IReport>('Report', ReportSchema);
export default Report;
