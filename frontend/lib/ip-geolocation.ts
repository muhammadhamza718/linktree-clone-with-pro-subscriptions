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
  deviceType: "mobile" | "tablet" | "desktop";
  browser?: string;
  os?: string;
}

// Mock geolocation service for development
// In production, this would connect to a real IP geolocation API like ipapi.co or ipgeolocation.io
export async function getGeolocationData(
  ipAddress: string,
): Promise<GeolocationData> {
  // In a real implementation, we would call an external service
  // For now, we'll return mock data based on the IP

  // This is just a mock implementation - in production, you would use a real service
  if (ipAddress === "127.0.0.1" || ipAddress.includes("::1")) {
    // Localhost - return some default values
    return {
      country: "Local",
      city: "Development",
      timezone: "UTC",
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
    country: "United States",
    city: "New York",
    region: "NY",
    timezone: "America/New_York",
    latitude: 40.7128,
    longitude: -74.006,
    isp: "Mock ISP",
  };
}

// Device and browser detection from user agent
export function getDeviceInfo(userAgent: string): DeviceInfo {
  try {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const deviceType =
      result.device.type === "mobile" || result.device.type === "tablet"
        ? result.device.type
        : "desktop";

    return {
      deviceType: deviceType as "mobile" | "tablet" | "desktop",
      browser: result.browser.name || "Unknown",
      os: result.os.name || "Unknown",
    };
  } catch (error) {
    // Fallback to simple regex if parser fails or is not available
    console.error("Error parsing user agent:", error);

    let deviceType: "mobile" | "tablet" | "desktop" = "desktop";
    if (/mobile|android|iphone|ipod/i.test(userAgent)) {
      deviceType = "mobile";
    } else if (/tablet|ipad/i.test(userAgent)) {
      deviceType = "tablet";
    }

    return {
      deviceType,
      browser: "Unknown",
      os: "Unknown",
    };
  }
}

// Main function to get all visitor demographics
export async function getVisitorDemographics(
  ipAddress: string,
  userAgent: string,
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
