import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const MainLayout = () => {
    return (
        <div>
            <Outlet></Outlet>
            <ToastContainer></ToastContainer>
        </div>
    );
};

export default MainLayout;