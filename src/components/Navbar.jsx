import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { FaUser } from 'react-icons/fa';

const Navbar = ({ setIsModalOpen }) => {

    const { user, logOutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogOut = ()  => {
        logOutUser()
        .then(() => {
            navigate('/');
        })
    }

    return (
        <div className="navbar w-[97%] mx-auto">
            <div className="flex-1">
                <Link
                    to="/home"
                    className={`text-2xl text-[#3b82f6] md:text-3xl font-righteous font-bold -mb-2`}
                >
                    TaskNest
                </Link>
            </div>
            <div className="flex-none gap-3">
                <button onClick={() => setIsModalOpen(true)} className='btn btn-sm bg-gradient-to-r from-blue-500 to-blue-700 text-white border-none rounded-lg'>+ New Task</button>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-8 rounded-full">
                            <img
                                alt={user?.displayName}
                                src={user?.photoURL} />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <div className="card-body p-2">
                            <button disabled className='btn btn-sm btn-ghost disabled:bg-transparent disabled:text-black'><FaUser />{user.displayName.split(" ")[0]}</button>
                            <div className="card-actions">
                                <button onClick={handleLogOut} className="btn btn-sm btn-error text-white border-none btn-block">Logout</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;