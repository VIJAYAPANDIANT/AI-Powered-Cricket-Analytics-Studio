import { Schema, model, Document } from 'mongoose';

export interface IScope {
  season?: string;
  team?: string;
  venue?: string;
}

export interface IAnalytics extends Document {
  scope: IScope;
  topBatters: Array<{
    name: string;
    runs: number;
    strikeRate: number;
    average: number;
  }>;
  topBowlers: Array<{
    name: string;
    wickets: number;
    economy: number;
    balls: number;
  }>;
  teamStats: Record<string, any>;
  venueStats: Record<string, any>;
  insights: string[];
  createdAt: Date;
}

const ScopeSchema = new Schema<IScope>(
  {
    season: {
      type: String,
      trim: true,
      index: true
    },
    team: {
      type: String,
      trim: true,
      index: true
    },
    venue: {
      type: String,
      trim: true,
      index: true
    }
  },
  { _id: false }
);

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    scope: {
      type: ScopeSchema,
      required: [true, 'Analytical scope metadata is required.']
    },
    topBatters: [
      {
        name: { type: String, required: true },
        runs: { type: Number, required: true },
        strikeRate: { type: Number, required: true },
        average: { type: Number, required: true }
      }
    ],
    topBowlers: [
      {
        name: { type: String, required: true },
        wickets: { type: Number, required: true },
        economy: { type: Number, required: true },
        balls: { type: Number, required: true }
      }
    ],
    teamStats: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {}
    },
    venueStats: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {}
    },
    insights: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false }
  }
);

// Compound index to quickly fetch cached summaries matching season and team filters
AnalyticsSchema.index({ 'scope.season': 1, 'scope.team': 1 });

export const Analytics = model<IAnalytics>('Analytics', AnalyticsSchema);
export default Analytics;
