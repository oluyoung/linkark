import { Fragment } from 'react';
// import Nav from '@/app/components/public/Nav';
import Main from '../components/public/Main';

async function layout({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      {/* <Nav /> */}
      <Main>{children}</Main>
    </Fragment>
  );
}

export default layout;
