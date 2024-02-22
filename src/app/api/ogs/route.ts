import { NextResponse, NextRequest } from 'next/server';
import ogs from 'open-graph-scraper';
import { createHash } from 'node:crypto';
import { LinkMeta } from '@/app/lib/actions/links.actions';

/*
 - in link creation if og meta exist no need to do scrape again,
 - handle not found error as link is typed
 - this should happen on blur
*/
export async function POST(req: NextRequest) {
  const { uri } = (await req.json()) as { uri: string };

  const hash = createHash('sha512');
  const url = new URL(uri);

  // this is written this away so errors fail silently
  const ogsResult = await ogs({ url: uri })
    .then((res) => res)
    .catch((error) => error);

  let ogTitle, ogType, ogUrl, ogDescription;
  if (ogsResult) {
    if (ogsResult.error) {
      // Only care if the url does not exist
      if (ogsResult.result.error === 'Page not found')
        throw new Error('This URL does not exist');
    } else {
      ogTitle = ogsResult.result.ogTitle;
      ogType = ogsResult.result.ogType;
      ogUrl = ogsResult.result.ogUrl;
      ogDescription = ogsResult.result.ogDescription;
    }
  }

  return NextResponse.json({
    origin: url.origin,
    hostname: url.hostname,
    path: url.pathname,
    query: url.search,
    rawUrl: url.href,
    rawUrlHash: hash.update(url.href).digest('hex'),
    ogTitle,
    ogDescription,
    ogType,
    ogUrl,
  } as LinkMeta);
}
