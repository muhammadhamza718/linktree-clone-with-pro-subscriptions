// User types
export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified?: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  email: string;
  name: string;
  password?: string;
}

// Profile types
export interface Profile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  avatarLayout?: 'classic' | 'hero';
  title?: string;
  themeId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileCreateInput {
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  avatarLayout?: 'classic' | 'hero';
  title?: string;
  themeId?: string;
}

export interface ProfileUpdateInput {
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  avatarLayout?: 'classic' | 'hero';
  title?: string;
  themeId?: string;
}

// Link types
export interface Link {
  id: string;
  profileId: string;
  title: string;
  url: string;
  linkType?: 'social' | 'website' | 'project' | 'email' | 'phone' | 'embed' | 'custom';
  thumbnail?: string;
  icon?: string;
  order: number;
  isVisible: boolean;
  isFeatured: boolean;
  githubRepo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkCreateInput {
  title: string;
  url: string;
  linkType?: 'social' | 'website' | 'project' | 'email' | 'phone' | 'embed' | 'custom';
  thumbnail?: string;
  icon?: string;
  order: number;
  isVisible?: boolean;
  isFeatured?: boolean;
  githubRepo?: string;
}

export interface LinkUpdateInput {
  title?: string;
  url?: string;
  linkType?: 'social' | 'website' | 'project' | 'email' | 'phone' | 'embed' | 'custom';
  thumbnail?: string;
  icon?: string;
  order?: number;
  isVisible?: boolean;
  isFeatured?: boolean;
  githubRepo?: string;
}

// Theme types
export interface Theme {
  id: string;
  name: string;
  userId?: string;
  presetName?: string;
  backgroundColor?: string;
  textColor?: string;
  linkColor?: string;
  buttonStyle?: 'rounded' | 'square' | 'pill';
  buttonColor?: 'solid' | 'gradient' | 'glass';
  fontFamily?: string;
  fontSize?: string;
  isLightMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeCreateInput {
  name: string;
  presetName?: string;
  backgroundColor?: string;
  textColor?: string;
  linkColor?: string;
  buttonStyle?: 'rounded' | 'square' | 'pill';
  buttonColor?: 'solid' | 'gradient' | 'glass';
  fontFamily?: string;
  fontSize?: string;
  isLightMode?: boolean;
}

export interface ThemeUpdateInput {
  name?: string;
  presetName?: string;
  backgroundColor?: string;
  textColor?: string;
  linkColor?: string;
  buttonStyle?: 'rounded' | 'square' | 'pill';
  buttonColor?: 'solid' | 'gradient' | 'glass';
  fontFamily?: string;
  fontSize?: string;
  isLightMode?: boolean;
}

// AnalyticsEvent types
export interface AnalyticsEvent {
  id: string;
  profileId?: string;
  linkId?: string;
  eventType: 'profile_view' | 'link_click';
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  timestamp: Date;
}

export interface AnalyticsEventCreateInput {
  profileId?: string;
  linkId?: string;
  eventType: 'profile_view' | 'link_click';
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}