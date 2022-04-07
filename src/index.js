import React from 'react';
import {render} from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import Hamburger from 'hamburger-react'
import App from './App';
import Navbar from './components/Navbar';

function AppWrapper() {
  return (
    <>
      <Navbar />
      <App/>
    </>
  );
}

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

root.render(<AppWrapper />);
