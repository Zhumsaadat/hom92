import './App.css';
import AppToolbar from './components/UI/AppToolbar.tsx';
import {Route, Routes} from 'react-router-dom';
import Login from './features/Users/Login.tsx';
import Register from './features/Users/Register.tsx';
import { Alert } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import {useAppSelector} from './App/hooks.ts';
import {selectUser} from './features/Users/usersSlice.ts';
import Chat from './features/Chats/Chat.tsx';

function App() {
    const user = useAppSelector(selectUser);

    return (
        <>
            <header>
                <AppToolbar />
            </header>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute isAllowed={user && user.role !== ''}>
                        {user && <Chat />}
                    </ProtectedRoute>
                } />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Alert severity="error">Not found!</Alert>} />
            </Routes>
        </>
    )
}

export default App;