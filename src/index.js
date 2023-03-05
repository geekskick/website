import React from 'react';
import ReactDOM from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import App from './app.js';

function AppView() {
    return (
        <SnackbarProvider maxSnack={3}>
            <App />
        </SnackbarProvider>);
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
(async () => {
    try {
        root.render(<AppView />);
    } catch (error) {
        console.log('Error = ', error);
    }
})();
