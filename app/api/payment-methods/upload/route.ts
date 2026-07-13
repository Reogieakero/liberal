import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

const BUCKET = 'payment-method-qrcodes';
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get('file');
  const oldPath = formData?.get('oldPath');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File is too large (max 10MB)' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Only PNG, JPG, or WEBP images are allowed' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const newPath = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(newPath, buffer, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  // Clean up the previous file, if replacing one.
  if (typeof oldPath === 'string' && oldPath) {
    await supabaseAdmin.storage.from(BUCKET).remove([oldPath]);
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(newPath);

  return NextResponse.json({
    url: publicUrlData.publicUrl,
    path: newPath,
    name: file.name,
  });
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const path = body?.path;

  if (!path || typeof path !== 'string') {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}