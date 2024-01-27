'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

export default function ReduxProvider({ children }: React.PropsWithChildren) {
  return <Provider store={store}>{children}</Provider>;
}
