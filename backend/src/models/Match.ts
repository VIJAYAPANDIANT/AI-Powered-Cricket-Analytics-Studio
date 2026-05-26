import { Schema, model, Document } from 'mongoose';

export interface IMatch extends Document {
  matchId: number;
  season: string;
  team1: string;
  team2: string;
  tossWinner: string;
  tossDecision: 'bat' | 'field';
  winner: string;
  venue: string;
  date: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    matchId: {
      type: Number,
      required: [true, 'Match ID is required.'],
      unique: true,
      index: true // Primary identifier index matching CSV keys
    },
    season: {
      type: String,
      required: [true, 'Match season year is required.'],
      index: true // Core filter index
    },
    team1: {
      type: String,
      required: [true, 'Team 1 name is required.'],
      trim: true
    },
    team2: {
      type: String,
      required: [true, 'Team 2 name is required.'],
      trim: true
    },
    tossWinner: {
      type: String,
      required: [true, 'Toss winner name is required.'],
      trim: true
    },
    tossDecision: {
      type: String,
      required: [true, 'Toss decision is required.'],
      enum: {
        values: ['bat', 'field'],
        message: '{VALUE} is not a valid toss decision.'
      }
    },
    winner: {
      type: String,
      trim: true,
      index: true // Accelerates win-rate lookups
    },
    venue: {
      type: String,
      required: [true, 'Match venue is required.'],
      trim: true,
      index: true // Accelerates venue bias lookups
    },
    date: {
      type: Date,
      required: [true, 'Match date is required.']
    }
  },
  {
    _id: true // Standard MongoDB ObjectId is preserved alongside numeric matchId
  }
);

// Compound index to speed up direct team-vs-team matches lookup
MatchSchema.index({ team1: 1, team2: 1 });

export const Match = model<IMatch>('Match', MatchSchema);
export default Match;
