import React from 'react';
import {render} from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import Hamburger from 'hamburger-react'
import App from './App';

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

root.render(<App />);
