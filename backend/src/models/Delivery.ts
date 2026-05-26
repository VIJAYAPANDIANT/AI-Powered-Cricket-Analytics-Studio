import { Schema, model, Document } from 'mongoose';

export interface IWicketDetail {
  playerDismissed?: string;
  dismissalKind?: 'caught' | 'bowled' | 'lbw' | 'run out' | 'stumped' | 'caught and bowled' | 'hit wicket' | 'retired hurt' | string;
  fielder?: string;
}

export interface IDelivery extends Document {
  matchId: number;
  inning: number;
  over: number;
  ball: number;
  batter: string;
  bowler: string;
  nonStriker: string;
  battingTeam: string;
  bowlingTeam: string;
  runsOffBat: number;
  extraRuns: number;
  totalRuns: number;
  wicket: boolean;
  wicketDetail?: IWicketDetail;
}

const WicketDetailSchema = new Schema<IWicketDetail>(
  {
    playerDismissed: {
      type: String,
      trim: true
    },
    dismissalKind: {
      type: String,
      trim: true
    },
    fielder: {
      type: String,
      trim: true
    }
  },
  { _id: false } // No need for separate subdocument object IDs
);

const DeliverySchema = new Schema<IDelivery>(
  {
    matchId: {
      type: Number,
      required: [true, 'Match ID reference is required.'],
      index: true // Enables aggregation of deliveries by match
    },
    inning: {
      type: Number,
      required: [true, 'Inning number is required.'],
      min: [1, 'Inning must be at least 1.']
    },
    over: {
      type: Number,
      required: [true, 'Over number is required.'],
      min: [0, 'Over must be between 0 and 19.'],
      max: [19, 'Over must be between 0 and 19.']
    },
    ball: {
      type: Number,
      required: [true, 'Ball number is required.'],
      min: [1, 'Ball count must start at 1.']
    },
    batter: {
      type: String,
      required: [true, 'Batter name is required.'],
      trim: true,
      index: true // Core index for batting charts and scatter analysis
    },
    bowler: {
      type: String,
      required: [true, 'Bowler name is required.'],
      trim: true,
      index: true // Core index for bowling stats and econ charts
    },
    nonStriker: {
      type: String,
      required: [true, 'Non-striker name is required.'],
      trim: true
    },
    battingTeam: {
      type: String,
      required: [true, 'Batting team name is required.'],
      trim: true
    },
    bowlingTeam: {
      type: String,
      required: [true, 'Bowling team name is required.'],
      trim: true
    },
    runsOffBat: {
      type: Number,
      required: [true, 'Runs off bat is required.'],
      min: [0, 'Runs off bat cannot be negative.'],
      max: [6, 'Runs off bat cannot exceed 6.']
    },
    extraRuns: {
      type: Number,
      required: [true, 'Extra runs is required.'],
      min: [0, 'Extra runs cannot be negative.']
    },
    totalRuns: {
      type: Number,
      required: [true, 'Total runs is required.'],
      min: [0, 'Total runs cannot be negative.']
    },
    wicket: {
      type: Boolean,
      required: [true, 'Wicket flag is required.'],
      default: false
    },
    wicketDetail: WicketDetailSchema
  },
  {
    _id: true
  }
);

// Compound index to speed up over-by-over inning logs retrieval in proper chronological sequence
// Also acts as a unique constraint to avoid duplicate deliveries data load
DeliverySchema.index({ matchId: 1, inning: 1, over: 1, ball: 1 }, { unique: true });

// Compound index to speed up matchup statistics query (e.g. Batter vs Bowler analytics)
DeliverySchema.index({ batter: 1, bowler: 1 });

export const Delivery = model<IDelivery>('Delivery', DeliverySchema);
export default Delivery;
