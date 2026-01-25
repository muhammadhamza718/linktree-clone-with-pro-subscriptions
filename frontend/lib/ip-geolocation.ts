/**
 * IP Geolocation Service
 * Provides visitor demographic data including location, device type, and browser information
 */

// Interface for geolocation data
export interface GeolocationData {
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
}

// Interface for device detection
export interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
}

// Mock geolocation service for development
// In production, this would connect to a real IP geolocation API like ipapi.co or ipgeolocation.io
export async function getGeolocationData(ipAddress: string): Promise<GeolocationData> {
  // In a real implementation, we would call an external service
  // For now, we'll return mock data based on the IP

  // This is just a mock implementation - in production, you would use a real service
  if (ipAddress === '127.0.0.1' || ipAddress.includes('::1')) {
    // Localhost - return some default values
    return {
      country: 'Local',
      city: 'Development',
      timezone: 'UTC',
    };
  }

  // In a real implementation, you would call a service like:
  /*
  const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
  const data = await response.json();

  return {
    country: data.country_name,
    city: data.city,
    region: data.region,
    timezone: data.timezone,
    latitude: data.latitude,
    longitude: data.longitude,
    isp: data.org,
  };
  */

  // For now, return mock data
  return {
    country: 'United States',
    city: 'New York',
    region: 'NY',
    timezone: 'America/New_York',
    latitude: 40.7128,
    longitude: -74.0060,
    isp: 'Mock ISP',
  };
}

// Device and browser detection from user agent
export function getDeviceInfo(userAgent: string): DeviceInfo {
  // Device type detection
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  if (/mobile|android|iphone|ipod/i.test(userAgent)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad/i.test(userAgent)) {
    deviceType = 'tablet';
  }

  // Browser detection
  let browser = 'Unknown';
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    browser = 'Internet Explorer';
  }

  // OS detection
  let os = 'Unknown';
  if (userAgent.includes('Win')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
    deviceType = 'mobile'; // Override if Android
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
    deviceType = userAgent.includes('iPad') ? 'tablet' : 'mobile';
  }

  return {
    deviceType,
    browser,
    os,
  };
}

// Main function to get all visitor demographics
export async function getVisitorDemographics(
  ipAddress: string,
  userAgent: string
): Promise<GeolocationData & DeviceInfo> {
  // Get geolocation data
  const geoData = await getGeolocationData(ipAddress);

  // Get device info
  const deviceInfo = getDeviceInfo(userAgent);

  // Combine and return
  return {
    ...geoData,
    ...deviceInfo,
  };
}