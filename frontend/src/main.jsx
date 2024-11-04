import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ContextProvider from './context/storeContext.jsx'
import SocketProvider from './context/socket.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ContextProvider>
            <SocketProvider>
                <App />
            </SocketProvider>
        </ContextProvider>
    </BrowserRouter>
)
