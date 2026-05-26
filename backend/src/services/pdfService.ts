import PDFDocument from 'pdfkit';
import { AnalyticsFilter } from '../models/types';

export class PdfService {
  public static generateAnalyticsReport(
    metrics: {
      totalMatches: number;
      totalTeams: number;
      totalRuns: number;
      totalWickets: number;
      highestTeamScore: number;
      averageMatchScore: number;
    },
    charts: {
      topBatters: any[];
      topBowlers: any[];
    },
    insights: string[],
    filter: AnalyticsFilter
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        // 1. Cover Header
        doc.rect(0, 0, 595.28, 120)
           .fill('#111827'); // dark background

        doc.fillColor('#FBBF24') // gold accent
           .fontSize(26)
           .font('Helvetica-Bold')
           .text('IPL InsightX', 50, 35);

        doc.fillColor('#FFFFFF')
           .fontSize(14)
           .font('Helvetica')
           .text('AI Powered Cricket Analytics Studio — Executive Briefing', 50, 70);

        // Spacer
        doc.moveDown(4);

        // 2. Active Filters Panel
        doc.fillColor('#1F2937')
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('Active Analytical Scope', 50, 150);

        doc.strokeColor('#E5E7EB')
           .lineWidth(1)
           .moveTo(50, 168)
           .lineTo(545, 168)
           .stroke();

        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#4B5563');

        const activeFilters = [
          `Season: ${filter.season || 'All Seasons'}`,
          `Team: ${filter.team || 'All Teams'}`,
          `Batter: ${filter.batter || 'All Batters'}`,
          `Bowler: ${filter.bowler || 'All Bowlers'}`,
          `Venue: ${filter.venue || 'All Venues'}`
        ].join('   |   ');

        doc.text(activeFilters, 50, 178);

        // Spacer
        doc.moveDown(2);

        // 3. Overview Statistics Grid
        doc.fillColor('#1F2937')
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('KPI Metric Performance', 50, 215);

        doc.strokeColor('#E5E7EB')
           .lineWidth(1)
           .moveTo(50, 233)
           .lineTo(545, 233)
           .stroke();

        // Table Grid coordinates
        const startY = 245;
        const colWidth = 160;
        const rowHeight = 45;

        const kpis = [
          { label: 'Total Matches', value: String(metrics.totalMatches) },
          { label: 'Total Teams In-Scope', value: String(metrics.totalTeams) },
          { label: 'Cumulative Runs Scored', value: String(metrics.totalRuns.toLocaleString()) },
          { label: 'Cumulative Wickets taken', value: String(metrics.totalWickets) },
          { label: 'Highest Innings Score', value: `${metrics.highestTeamScore} runs` },
          { label: 'Average Inning Score', value: `${metrics.averageMatchScore} runs` }
        ];

        kpis.forEach((kpi, index) => {
          const r = Math.floor(index / 3);
          const c = index % 3;
          const x = 50 + c * colWidth;
          const y = startY + r * rowHeight;

          // Background card shape
          doc.rect(x, y, colWidth - 10, rowHeight - 8)
             .fillColor('#F9FAFB')
             .fill()
             .strokeColor('#F3F4F6')
             .stroke();

          // Card labels
          doc.fillColor('#9CA3AF')
             .fontSize(8)
             .font('Helvetica-Bold')
             .text(kpi.label.toUpperCase(), x + 8, y + 8);

          doc.fillColor('#111827')
             .fontSize(14)
             .font('Helvetica-Bold')
             .text(kpi.value, x + 8, y + 20);
        });

        // 4. Tactical AI Observations
        const insightsY = 360;
        doc.fillColor('#1F2937')
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('AI Tactical Insights & Observations', 50, insightsY);

        doc.strokeColor('#E5E7EB')
           .lineWidth(1)
           .moveTo(50, insightsY + 18)
           .lineTo(545, insightsY + 18)
           .stroke();

        let bulletY = insightsY + 30;
        insights.slice(0, 5).forEach((insight) => {
          // Draw a small bullet circle
          doc.circle(55, bulletY + 6, 3)
             .fillColor('#059669') // emerald bullet
             .fill();

          doc.fillColor('#374151')
             .fontSize(9.5)
             .font('Helvetica')
             .text(insight, 70, bulletY, { width: 470, lineGap: 3 });

          const lines = doc.heightOfString(insight, { width: 470 }) + 10;
          bulletY += lines;
        });

        // 5. Player Standings
        const playersY = bulletY + 15;
        doc.fillColor('#1F2937')
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('High-Performer Board (Top 3)', 50, playersY);

        doc.strokeColor('#E5E7EB')
           .lineWidth(1)
           .moveTo(50, playersY + 18)
           .lineTo(545, playersY + 18)
           .stroke();

        // Columns: Top Batters & Top Bowlers
        const tableStartY = playersY + 30;

        // Header Batters
        doc.fillColor('#111827')
           .fontSize(10)
           .font('Helvetica-Bold')
           .text('TOP BATTERS (RUNS)', 50, tableStartY);

        doc.fontSize(9)
           .font('Helvetica-Bold')
           .fillColor('#6B7280')
           .text('Batter Name', 50, tableStartY + 18)
           .text('Runs', 180, tableStartY + 18)
           .text('S/R', 220, tableStartY + 18);

        charts.topBatters.slice(0, 3).forEach((b, i) => {
          const rowY = tableStartY + 35 + i * 18;
          doc.font('Helvetica')
             .fillColor('#374151')
             .text(`${i + 1}. ${b.name}`, 50, rowY)
             .text(String(b.runs), 180, rowY)
             .text(`${b.strikeRate}%`, 220, rowY);
        });

        // Header Bowlers
        doc.fillColor('#111827')
           .fontSize(10)
           .font('Helvetica-Bold')
           .text('TOP BOWLERS (WICKETS)', 320, tableStartY);

        doc.fontSize(9)
           .font('Helvetica-Bold')
           .fillColor('#6B7280')
           .text('Bowler Name', 320, tableStartY + 18)
           .text('Wkts', 450, tableStartY + 18)
           .text('Econ', 490, tableStartY + 18);

        charts.topBowlers.slice(0, 3).forEach((bw, i) => {
          const rowY = tableStartY + 35 + i * 18;
          doc.font('Helvetica')
             .fillColor('#374151')
             .text(`${i + 1}. ${bw.name}`, 320, rowY)
             .text(String(bw.wickets), 450, rowY)
             .text(String(bw.economy), 490, rowY);
        });

        // Footer note
        doc.fontSize(8)
           .fillColor('#9CA3AF')
           .font('Helvetica-Oblique')
           .text('IPL InsightX AI analytics. Reports automatically compiled based on delivery logs. Confidential.', 50, 770, { align: 'center' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
export default PdfService;
