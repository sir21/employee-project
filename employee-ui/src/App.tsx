import React, { FC } from 'react';

import './App.less';
import LayoutComponent from './components/LayoutComponent';

const App: FC = () => {
  return (
    <>
      <LayoutComponent data-test-id="layout"/>
    </>
  );
}

export default App;
