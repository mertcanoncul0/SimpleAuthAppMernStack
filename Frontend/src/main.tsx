import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthContext, defaultAuthContextValues } from './context';

ReactDOM.createRoot(document.querySelector('#root')!).render(
    <AuthContext.Provider value={defaultAuthContextValues}>
        <RouterProvider router={router} />
    </AuthContext.Provider>
);