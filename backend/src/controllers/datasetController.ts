import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from '../config/db';
import { analyticsService } from '../services/analyticsService';
import { DatasetMetadata } from '../models/types';
import { flushCache } from '../middleware/cacheMiddleware';

export const uploadMatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload matches.csv file.' });
    }

    const filePath = req.file.path;
    const requiredHeaders = ['id', 'season', 'team1', 'team2', 'winner', 'venue'];

    const validation = await analyticsService.validateCSVHeaders(filePath, requiredHeaders);

    if (!validation.isValid) {
      // Delete the invalid file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'Matches CSV validation failed.',
        errors: [`Missing required columns: ${validation.missing.join(', ')}`]
      });
    }

    // Read file size and line count
    const stats = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '').length - 1; // count rows excluding header

    const metadata: DatasetMetadata = {
      filename: req.file.filename,
      fileType: 'matches',
      sizeBytes: stats.size,
      rowCount: lines > 0 ? lines : 0,
      uploadedAt: new Date().toISOString(),
      status: 'valid'
    };

    db.saveMetadata(metadata);

    // Refresh memory data
    await analyticsService.initializeData();
    flushCache();

    res.status(200).json({
      success: true,
      message: 'Matches CSV uploaded and validated successfully.',
      metadata
    });
  } catch (error) {
    next(error);
  }
};

export const uploadDeliveries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload deliveries.csv file.' });
    }

    const filePath = req.file.path;
    const requiredHeaders = ['match_id', 'inning', 'batting_team', 'bowling_team', 'over', 'ball', 'batter', 'bowler', 'total_runs'];

    const validation = await analyticsService.validateCSVHeaders(filePath, requiredHeaders);

    if (!validation.isValid) {
      // Delete the invalid file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'Deliveries CSV validation failed.',
        errors: [`Missing required columns: ${validation.missing.join(', ')}`]
      });
    }

    // Read file size and line count
    const stats = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '').length - 1; // count rows excluding header

    const metadata: DatasetMetadata = {
      filename: req.file.filename,
      fileType: 'deliveries',
      sizeBytes: stats.size,
      rowCount: lines > 0 ? lines : 0,
      uploadedAt: new Date().toISOString(),
      status: 'valid'
    };

    db.saveMetadata(metadata);

    // Refresh memory data
    await analyticsService.initializeData();
    flushCache();

    res.status(200).json({
      success: true,
      message: 'Deliveries CSV uploaded and validated successfully.',
      metadata
    });
  } catch (error) {
    next(error);
  }
};

export const getMetadataList = (req: Request, res: Response) => {
  const metadata = db.getMetadata();
  res.status(200).json({
    success: true,
    metadata
  });
};

export default { uploadMatches, uploadDeliveries, getMetadataList };
