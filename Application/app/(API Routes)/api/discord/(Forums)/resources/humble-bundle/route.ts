// app/api/test-directory/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const url = 'https://www.humblebundle.com/bundles';

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html',
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: `HTTP ${response.status}` }, { status: 500 });
    }

    const html = await response.text();

    // 1. The Foolproof Extraction: No regex, just split the string at the exact tag
    const marker = '<script id="landingPage-json-data" type="application/json">';

    if (!html.includes(marker)) {
      return NextResponse.json({ success: false, error: 'Could not find the JSON marker in the HTML.' }, { status: 404 });
    }

    // Split at the marker, take the right half, then split at the closing tag and take the left half
    const jsonString = html.split(marker)[1].split('</script>')[0].trim();

    // 2. Parse the isolated JSON
    const rawData = JSON.parse(jsonString);

    // 3. Map the active bundles from all three main categories
    const categories = ['games', 'books', 'software'];
    const activeBundles: any[] = [];

    categories.forEach(category => {
      // Humble Bundle nests the active products inside mosaic[0].products
      if (rawData.data && rawData.data[category] && rawData.data[category].mosaic) {
        const products = rawData.data[category].mosaic[0].products;
        activeBundles.push(...products);
      }
    });

    // 4. Format the data perfectly for your Discord Bot embed
    const formattedBundles = activeBundles.map(bundle => ({
      id: bundle.machine_name,
      title: bundle.tile_short_name || bundle.tile_name,
      category: bundle.tile_stamp, // e.g., 'games', 'books'
      url: `https://www.humblebundle.com${bundle.product_url}`,
      endDate: bundle['end_date|datetime'],
      blurb: bundle.marketing_blurb
    }));

    return NextResponse.json({
      success: true,
      count: formattedBundles.length,
      data: formattedBundles
    });

  } catch (err) {

    const message = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}