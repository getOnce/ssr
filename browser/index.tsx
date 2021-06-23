import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { loadableReady } from '@loadable/component';
loadableReady(() => {
    const root = document.getElementById('root');
    ReactDOM.hydrate(<App />, root);
});
