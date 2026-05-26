// app/api/cron/check-deals/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

// The interests of your Discord server
const KEYWORDS = ["python", "c++", "cybersecurity", "claude", "rpg", "unreal", "unity"]; 
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!;

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use the service role key to bypass RLS in the cron job
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  // 1. Vercel Cron Security Check
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 2. The Extraction (From Iteration 8)
    const url = 'https://www.humblebundle.com/bundles'; 
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html',
      },
      next: { revalidate: 0 } 
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();

    const marker = '<script id="landingPage-json-data" type="application/json">';
    if (!html.includes(marker)) throw new Error('JSON marker not found.');

    const jsonString = html.split(marker)[1].split('</script>')[0].trim();
    const rawData = JSON.parse(jsonString);

    const categories = ['games', 'books', 'software'];
    const activeBundles: any[] = [];

    categories.forEach(category => {
      if (rawData.data && rawData.data[category] && rawData.data[category].mosaic) {
         activeBundles.push(...rawData.data[category].mosaic[0].products);
      }
    });

    let newDealsAlerted = 0;

    // 3. The Logic Loop: Filter, Check Supabase, and Alert
    for (const bundle of activeBundles) {
      const machineName = bundle.machine_name;
      const title = bundle.tile_short_name || bundle.tile_name;
      const link = `https://www.humblebundle.com${bundle.product_url}`;
      
      // A. Keyword Matching
      const searchText = `${title} ${machineName}`.toLowerCase();
      const isMatch = KEYWORDS.some(keyword => {
        const pattern = new RegExp(`(?<![a-z])${keyword.toLowerCase()}(?![a-z])`, 'i');
        return pattern.test(searchText);
      });

      if (!isMatch) continue;

      // B. Supabase Persistence Check (Have we alerted them about this already?)
      const { data: seen } = await supabase
        .from('seen_bundles')
        .select('id')
        .eq('id', machineName)
        .single();

      if (seen) continue; // Skip it, we already posted it in the past

      // C. Push the Discord Embed
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: `🚨 New Humble Bundle: ${title}`,
            url: link,
            description: bundle.marketing_blurb,
            color: 16734296, // Humble Bundle Red/Orange
            image: { url: bundle.high_res_tile_image },
            footer: { text: `Ends: ${new Date(bundle['end_date|datetime']).toLocaleDateString()}` }
          }]
        })
      });

      // D. Save to Supabase to prevent duplicates tomorrow
      await supabase.from('seen_bundles').insert([{ id: machineName }]);
      
      newDealsAlerted++;
    }

    return NextResponse.json({ success: true, newDealsAlerted });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}