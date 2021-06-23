// import react from 'react';
import loadable from '@loadable/component';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
const OtherComponent = loadable(() => import('./OtherComponent'));
const OtherComponent2 = loadable(() => import('./OtherComponent2'));
function App() {
    const [showOC2, setShowOC2] = useState(false);
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p
                    onClick={() => {
                        setShowOC2(true);
                    }}
                >
                    Edit <code>src/App.tsx</code> and save to reload.1111
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            {showOC2 && <OtherComponent2 />}
            <OtherComponent></OtherComponent>
        </div>
    );
}

export default App;
