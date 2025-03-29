import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import 'flowbite';
import 'flowbite-react';

// Create a React Query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
    <React.StrictMode>
                <App />
    </React.StrictMode>
</QueryClientProvider>
);
