import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { data, error } = await supabaseAdmin
    .from('payment_methods')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { type, accountName, accountNumber, isActive, qrUrl, qrPath, qrName } = body;

  if (!type || !accountName || !accountNumber) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const uniqueNum = Math.floor(1000 + Math.random() * 9000);
  const code = `PM-${uniqueNum}`;

  const { data, error } = await supabaseAdmin
    .from('payment_methods')
    .insert([
      {
        method_code: code,
        method_type: type,
        account_name: accountName,
        account_number: accountNumber,
        is_active: isActive ?? true,
        qr_image_url: qrUrl ?? null,
        qr_image_path: qrPath ?? null,
        qr_image_name: qrName ?? null,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}