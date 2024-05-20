import { Fragment } from 'react';
import Nav from '@/app/components/home/Nav';
import Main from '../components/Main';

async function layout({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      <Nav />
      <Main>{children}</Main>
    </Fragment>
  );
}

export default layout;
