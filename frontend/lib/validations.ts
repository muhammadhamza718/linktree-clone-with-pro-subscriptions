import { z } from "zod";

// Re-export specific validation functions from utils if needed elsewhere
export {
  isValidUsername,
  isValidUrl,
  isValidEmail,
  isValidBio,
  isValidLinkTitle,
  isValidImageUrl,
} from "./utils";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Helper to convert Zod result to ValidationResult
function formatZodResult(
  result: z.SafeParseReturnType<any, any>,
): ValidationResult {
  if (result.success) {
    return { isValid: true, errors: [] };
  }
  return {
    isValid: false,
    errors: result.error.errors.map((e) => e.message),
  };
}

// --- Schemas ---

export const userSchema = z.object({
  email: z.string().email("Valid email is required"),
  name: z.string().min(1, "Name is required").trim(),
});

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
      "Username must contain only letters, numbers, and hyphens",
    ),
  displayName: z.string().min(1, "Display name is required").trim(),
  bio: z.string().max(280, "Bio must be 280 characters or less").optional(),
  avatar: z
    .string()
    .url("Avatar must be a valid image URL")
    .optional()
    .or(z.literal("")),
  title: z.string().optional(),
  themeId: z.string().optional(),
  avatarLayout: z.enum(["classic", "hero"]).optional(),
});

export const linkSchema = z.object({
  title: z
    .string()
    .min(1, "Link title is required")
    .max(100, "Link title must be 100 characters or less"),
  url: z.string().url("Valid URL is required"),
  order: z
    .number()
    .nonnegative("Order must be a non-negative number")
    .default(0),
  thumbnail: z
    .string()
    .url("Thumbnail must be a valid image URL")
    .optional()
    .or(z.literal("")),
  icon: z
    .string()
    .url("Icon must be a valid image URL")
    .optional()
    .or(z.literal("")),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  linkType: z
    .enum(["social", "website", "project", "email", "phone", "embed", "custom"])
    .optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  timezone: z.string().optional().nullable(),
});

export const themeSchema = z.object({
  name: z.string().min(1, "Theme name is required").trim(),
  backgroundColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgba?\(.*\)$/,
      "Invalid background color format",
    )
    .optional(),
  textColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgba?\(.*\)$/,
      "Invalid text color format",
    )
    .optional(),
  linkColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgba?\(.*\)$/,
      "Invalid link color format",
    )
    .optional(),
  buttonStyle: z.enum(["rounded", "square", "pill"]).optional(),
  buttonColor: z.enum(["solid", "gradient", "glass"]).optional(),
  fontFamily: z.string().optional(),
  fontSize: z.string().optional(),
  isLightMode: z.boolean().default(false),
});

export const contactFormSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .email("Valid email is required")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters"),
});

export const richContentBlockSchema = z
  .object({
    contentType: z.enum(["embed", "text", "form", "gallery"], {
      errorMap: () => ({
        message: "Content type must be one of: embed, text, form, gallery",
      }),
    }),
    content: z.string().min(1, "Content is required"),
    title: z
      .string()
      .max(100, "Title must be 100 characters or less")
      .optional(),
    position: z.number().nonnegative("Position must be a non-negative number"),
  })
  .refine(
    (data) => {
      if (data.contentType === "embed") {
        return z.string().url().safeParse(data.content).success;
      }
      return true;
    },
    {
      message: "Embed content must be a valid URL",
      path: ["content"],
    },
  );

export const customDomainSchema = z.object({
  domain: z
    .string()
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/,
      "Domain must be a valid domain format",
    ),
});

export const customCSSSchema = z.object({
  cssCode: z
    .string()
    .min(1, "CSS code is required")
    .refine(
      (val) => !/expression\s*\(|javascript:|vbscript:|data:/i.test(val),
      "CSS contains potentially dangerous patterns",
    ),
});

export const analyticsEventSchema = z.object({
  eventType: z.enum(["profile_view", "link_click"]),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  linkId: z.string().optional(),
  profileId: z.string().optional(),
});

// --- Validation Functions (Adapters for existing code) ---

export function validateUser(userData: any): ValidationResult {
  return formatZodResult(userSchema.safeParse(userData));
}

export function validateProfile(profileData: any): ValidationResult {
  return formatZodResult(profileSchema.safeParse(profileData));
}

export function validateLink(linkData: any): ValidationResult {
  return formatZodResult(linkSchema.safeParse(linkData));
}

export function validateTheme(themeData: any): ValidationResult {
  return formatZodResult(themeSchema.safeParse(themeData));
}

export function validateContactForm(formData: any): ValidationResult {
  return formatZodResult(contactFormSchema.safeParse(formData));
}

export function validateRichContentBlock(blockData: any): ValidationResult {
  return formatZodResult(richContentBlockSchema.safeParse(blockData));
}

export function validateCustomDomain(domainData: any): ValidationResult {
  return formatZodResult(customDomainSchema.safeParse(domainData));
}

export function validateCustomCSS(cssData: any): ValidationResult {
  return formatZodResult(customCSSSchema.safeParse(cssData));
}

export function validateAnalyticsEvent(eventData: any): ValidationResult {
  return formatZodResult(analyticsEventSchema.safeParse(eventData));
}
