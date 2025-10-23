import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and keys
function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key are required. Please check your environment variables.');
  }
  
  return { supabaseUrl, supabaseAnonKey };
}

// Client-side Supabase instance (with anon key)
let _supabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_supabase) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Lazy export - only initialized when accessed
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    return getSupabase()[prop as keyof ReturnType<typeof createClient>];
  }
});

// Server-side Supabase instance (with service role key for admin operations)
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY and URL are required');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Storage bucket names
export const STORAGE_BUCKET = 'product-images';
export const PROFILE_PHOTOS_BUCKET = 'product-images'; // Using same bucket with profile-photos folder

// Helper function to upload image to Supabase Storage
export async function uploadImageToSupabase(
  file: File | Buffer,
  fileName: string,
  contentType: string,
  useAdmin = true,
  bucketName: string = STORAGE_BUCKET
): Promise<{ url: string; path: string }> {
  const client = useAdmin ? getSupabaseAdmin() : supabase;
  
  // Convert File to ArrayBuffer if needed
  const fileData = file instanceof File ? await file.arrayBuffer() : file;
  
  // Upload to Supabase Storage
  const { data, error } = await client.storage
    .from(bucketName)
    .upload(fileName, fileData, {
      contentType,
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = client.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    path: data.path,
  };
}

// Helper function to delete image from Supabase Storage
export async function deleteImageFromSupabase(
  filePath: string,
  bucketName: string = STORAGE_BUCKET
): Promise<void> {
  const client = getSupabaseAdmin();
  
  const { error } = await client.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) {
    console.error('Supabase delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}
