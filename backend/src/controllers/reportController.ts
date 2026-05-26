import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analyticsService';
import PdfService from '../services/pdfService';
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

export const downloadPdfReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = extractFilters(req);
    const metrics = analyticsService.getMetrics(filters);
    const charts = analyticsService.getChartsData(filters);
    const insights = analyticsService.getHiddenInsights(filters);

    const pdfBuffer = await PdfService.generateAnalyticsReport(metrics, charts, insights, filters);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ipl_insightx_report_${filters.season || 'all'}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const exportData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = extractFilters(req);
    const metrics = analyticsService.getMetrics(filters);
    const charts = analyticsService.getChartsData(filters);
    const insights = analyticsService.getHiddenInsights(filters);

    const exportObject = {
      scope: {
        filter: filters,
        timestamp: new Date().toISOString(),
        studio: 'IPL InsightX – AI Powered Cricket Analytics Studio'
      },
      metrics,
      charts: {
        topBatters: charts.topBatters,
        topBowlers: charts.topBowlers,
        tossImpact: charts.tossImpact,
        matchPhases: charts.matchPhases
      },
      insights
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=ipl_insightx_data_${filters.season || 'all'}.json`);
    res.status(200).send(JSON.stringify(exportObject, null, 2));
  } catch (error) {
    next(error);
  }
};

export const exportCsvReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = extractFilters(req);
    const metrics = analyticsService.getMetrics(filters);
    const charts = analyticsService.getChartsData(filters);

    let csvContent = `IPL InsightX - Analytical CSV Report\n`;
    csvContent += `Scope: Season: ${filters.season || 'All'}, Team: ${filters.team || 'All'}, Venue: ${filters.venue || 'All'}\n\n`;
    
    csvContent += `SUMMARY METRICS\n`;
    csvContent += `Metric,Value\n`;
    csvContent += `Total Matches,${metrics.totalMatches}\n`;
    csvContent += `Total Teams,${metrics.totalTeams}\n`;
    csvContent += `Total Runs,${metrics.totalRuns}\n`;
    csvContent += `Total Wickets,${metrics.totalWickets}\n`;
    csvContent += `Highest Team Score,${metrics.highestTeamScore}\n`;
    csvContent += `Average Match Score,${metrics.averageMatchScore}\n\n`;

    csvContent += `TOP BATTERS\n`;
    csvContent += `Name,Runs,Strike Rate,Average\n`;
    charts.topBatters.forEach((b: any) => {
      csvContent += `"${b.name}",${b.runs},${b.strikeRate},${b.average}\n`;
    });
    csvContent += `\n`;

    csvContent += `TOP BOWLERS\n`;
    csvContent += `Name,Wickets,Economy\n`;
    charts.topBowlers.forEach((bw: any) => {
      csvContent += `"${bw.name}",${bw.wickets},${bw.economy}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=ipl_insightx_report_${filters.season || 'all'}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

export default { downloadPdfReport, exportData, exportCsvReport };
