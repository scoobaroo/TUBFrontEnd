import React from 'react';
import {render} from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

function AppWrapper() {
    return (
        <App/>
    );
}

function App(){
    return (
        <div>App</div>
    );
}

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

root.render(<AppWrapper />);
