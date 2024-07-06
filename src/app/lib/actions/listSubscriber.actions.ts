'use server';

export const subscribeToList = async (id: string, subscribe: boolean, single: boolean) => {
  return { id, subscribe, single };
};