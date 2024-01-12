'use server';

import prismaClient from '@/app/db/prisma-client';
import { Link } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

interface FetchLinksProps {
  creatorId?: string;
}

export async function fetchLinks({ creatorId }: FetchLinksProps): Promise<Link[]> {
  noStore();

  const links = await prismaClient.link.findMany({
    where: {
      creatorId
    }
  });

  return links;
}
