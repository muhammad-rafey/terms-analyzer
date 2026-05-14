import { NextRequest, NextResponse } from 'next/server';
import WordExtractor from 'word-extractor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_SIZE = 2 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File is too large (max 2MB).' },
        { status: 400 },
      );
    }

    if (!file.name.toLowerCase().endsWith('.doc')) {
      return NextResponse.json(
        { success: false, error: 'This endpoint only accepts .doc files.' },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extractor = new WordExtractor();
    const extracted = await extractor.extract(buffer);
    const text = extracted.getBody();

    return NextResponse.json({ success: true, text });
  } catch (err) {
    console.error('[parse-doc] error:', err);
    return NextResponse.json(
      { success: false, error: 'Could not parse the .doc file.' },
      { status: 500 },
    );
  }
}
