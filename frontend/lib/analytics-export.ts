import prisma from './db';

/**
 * Service for exporting analytics data as CSV
 */

export interface AnalyticsExportOptions {
  profileId: string;
  startDate: Date;
  endDate: Date;
  dataType: 'clicks' | 'views' | 'referrers' | 'demographics';
}

// Export analytics data as CSV format
export async function exportAnalyticsData(options: AnalyticsExportOptions): Promise<string> {
  try {
    let data: any[] = [];

    switch (options.dataType) {
      case 'clicks':
        data = await prisma.analyticsEvent.findMany({
          where: {
            profileId: options.profileId,
            eventType: 'link_click',
            timestamp: {
              gte: options.startDate,
              lte: options.endDate,
            },
          },
          include: {
            link: true,
          },
          orderBy: { timestamp: 'desc' },
        });
        break;

      case 'views':
        data = await prisma.analyticsEvent.findMany({
          where: {
            profileId: options.profileId,
            eventType: 'profile_view',
            timestamp: {
              gte: options.startDate,
              lte: options.endDate,
            },
          },
          orderBy: { timestamp: 'desc' },
        });
        break;

      case 'referrers':
        data = await prisma.analyticsEvent.groupBy({
          by: ['referrer'],
          where: {
            profileId: options.profileId,
            eventType: 'profile_view',
            referrer: { not: null },
            timestamp: {
              gte: options.startDate,
              lte: options.endDate,
            },
          },
          _count: {
            referrer: true,
          },
          orderBy: { _count: { referrer: 'desc' } },
        });
        break;

      case 'demographics':
        data = await prisma.analyticsEvent.findMany({
          where: {
            profileId: options.profileId,
            timestamp: {
              gte: options.startDate,
              lte: options.endDate,
            },
          },
          select: {
            country: true,
            city: true,
            deviceType: true,
            browser: true,
            os: true,
            timestamp: true,
          },
          orderBy: { timestamp: 'desc' },
        });
        break;

      default:
        throw new Error('Invalid data type for export');
    }

    if (data.length === 0) {
      return 'No data available for the selected period';
    }

    // Generate CSV header from the first data item's keys
    const headers = Object.keys(data[0]).filter(key => key !== '_count');
    let csvContent = headers.join(',') + '\n';

    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        let value = item[header];
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'object') {
          value = JSON.stringify(value);
        } else if (value instanceof Date) {
          value = value.toISOString();
        }
        // Escape commas and quotes in values
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',');
      csvContent += row + '\n';
    });

    return csvContent;
  } catch (error) {
    console.error('Error exporting analytics data:', error);
    throw new Error('Failed to export analytics data');
  }
}