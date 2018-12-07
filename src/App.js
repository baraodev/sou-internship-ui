import React, { Fragment } from 'react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Jumbotron from './components/Jumbotron';
import Content from './components/Content';

import Reset from './assets/styles/Reset';
import Base from './assets/styles/Base';

import Avaliations from './assets/imgs/avaliacoes.svg';

const App = () => (
  <Fragment>
    <Reset />
    <Base />
    <Header />
    <Sidebar />
    <Jumbotron title="Estágios" icon={Avaliations} />
    <Content />
  </Fragment>
);

export default App;
