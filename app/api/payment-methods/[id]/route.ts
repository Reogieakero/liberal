import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

const BUCKET = 'payment-method-qrcodes';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { type, accountName, accountNumber, isActive, qrUrl, qrPath, qrName } = body;

  const { data, error } = await supabaseAdmin
    .from('payment_methods')
    .update({
      method_type: type,
      account_name: accountName,
      account_number: accountNumber,
      is_active: isActive,
      qr_image_url: qrUrl ?? null,
      qr_image_path: qrPath ?? null,
      qr_image_name: qrName ?? null,
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  // Look up the row first so we know whether there's a QR file to clean up.
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('payment_methods')
    .select('qr_image_path')
    .eq('id', params.id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 400 });
  }

  if (existing?.qr_image_path) {
    await supabaseAdmin.storage.from(BUCKET).remove([existing.qr_image_path]);
  }

  const { error: deleteError } = await supabaseAdmin
    .from('payment_methods')
    .delete()
    .eq('id', params.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}