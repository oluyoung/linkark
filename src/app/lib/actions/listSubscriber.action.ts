'use server';

import prismaClient from '@/app/db/prisma-client';
import { revalidatePath } from 'next/cache';
import { getIdOrRedirect } from './utils';


/**
 * Function to un/subscribe a user to a list
 */
export async function subscribeToList(listId: string, subscribe = true, single: boolean) {
  const creatorId = await getIdOrRedirect();

  try {
    if (subscribe) {
      await prismaClient.listSubscriber.create({
        data: {
          listId,
          subscriberId: creatorId
        }
      });
    } else {
      await prismaClient.listSubscriber.delete({
        where: {
          subscriberId_listId: {
            listId,
            subscriberId: creatorId
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error('Could not subscribe to list, please try again.');
  }

  if (!single) revalidatePath('/home/lists');
  else revalidatePath(`/home/lists/${listId}`);
}


/**
 * Function to fetch subscribers for a list
 */
// export async function fetchSubscribers(listId: string) {
//   const creatorId = await getIdOrRedirect();

//   try {
//     await prismaClient.listSubscriber.create({
//       data: {
//         listId,
//         subscriberId: creatorId
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     throw new Error('Could not subscribe to list, please try again.');
//   }

//   revalidatePath('/home/lists');
// }


/**
 * Function to fetch subscribers count
 */
// export async function fetchSubscribers(listId: string, subscribe = true) {
//   const creatorId = await getIdOrRedirect();

//   try {

//     if (subscribe) {
//       await prismaClient.listSubscriber.create({
//         data: {
//           listId,
//           subscriberId: creatorId
//         }
//       });
//     } else {
//       await prismaClient.listSubscriber.delete({
//         where: {
//           listId,
//           subscriberId: creatorId
//         }
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     throw new Error('Could not subscribe to list, please try again.');
//   }

//   revalidatePath('/home/lists');
// }
