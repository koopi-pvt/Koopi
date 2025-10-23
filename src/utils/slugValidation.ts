// Reserved slugs that cannot be used
const RESERVED_SLUGS = [
  'admin',
  'api',
  'www',
  'mail',
  'blog',
  'shop',
  'store',
  'help',
  'support',
  'about',
  'contact',
  'terms',
  'privacy',
  'login',
  'signup',
  'dashboard',
  'settings',
  'billing',
  'koopi',
  'app',
  'cdn',
  'static',
  'assets',
  'public',
];

export function validateSlug(slug: string): { valid: boolean; error?: string } {
  // Check if slug is provided
  if (!slug) {
    return { valid: false, error: 'Store slug is required' };
  }

  // Check length
  if (slug.length < 3) {
    return { valid: false, error: 'Store slug must be at least 3 characters' };
  }

  if (slug.length > 30) {
    return { valid: false, error: 'Store slug cannot exceed 30 characters' };
  }

  // Check format (lowercase, alphanumeric, hyphens only)
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return {
      valid: false,
      error: 'Store slug can only contain lowercase letters, numbers, and hyphens',
    };
  }

  // Check if starts or ends with hyphen
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return { valid: false, error: 'Store slug cannot start or end with a hyphen' };
  }

  // Check if reserved
  if (RESERVED_SLUGS.includes(slug.toLowerCase())) {
    return { valid: false, error: 'This store slug is reserved and cannot be used' };
  }

  return { valid: true };
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove invalid characters
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 30); // Limit to 30 characters
}

export function generateSubdomain(slug: string, baseDomain: string = 'koopi.com'): string {
  return `${slug}.${baseDomain}`;
}
