import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsFilter } from '../models/types';

const extractFilters = (req: Request): AnalyticsFilter => {
  const { season, team, batter, bowler, venue } = req.query;
  
  return {
    season: season ? String(season) : undefined,
    team: team ? String(team) : undefined,
    batter: batter ? String(batter) : undefined,
    bowler: bowler ? String(bowler) : undefined,
    venue: venue ? String(venue) : undefined
  };
};

export const getOverviewMetrics = (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = extractFilters(req);
    const metrics = analyticsService.getMetrics(filters);
    res.status(200).json({
      success: true,
      metrics
    });
  } catch (error) {
    next(error);
  }
};

export const getChartsData = (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = extractFilters(req);
    const charts = analyticsService.getChartsData(filters);
    res.status(200).json({
      success: true,
      charts
    });
  } catch (error) {
    next(error);
  }
};

export const getHiddenInsights = (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = extractFilters(req);
    const insights = analyticsService.getHiddenInsights(filters);
    res.status(200).json({
      success: true,
      insights
    });
  } catch (error) {
    next(error);
  }
};

export const getFilterOptions = (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = analyticsService.getFilterOptions();
    res.status(200).json({
      success: true,
      options
    });
  } catch (error) {
    next(error);
  }
};

export default { getOverviewMetrics, getChartsData, getHiddenInsights, getFilterOptions };
