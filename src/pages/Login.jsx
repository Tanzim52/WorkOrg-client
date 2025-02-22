import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {

    const { loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLoginWithGoogle = () => {
        loginWithGoogle()
            .then(result => {
                const name = result.user?.displayName;
                const photo = result.user?.photoURL;
                const email = result.user?.email;
                const createdAt = result.user?.metadata?.creationTime;
                const uid = result.user?.uid;
                const newUser = { name, email, photo, createdAt, uid };

                axios.put('https://task-nest-server.onrender.com/users', newUser)
                    .then(data => {
                        if (data.data.matchedCount > 0 || data.data.modifiedCount > 0 || data.data.upsertedCount > 0) {
                            navigate('/home');
                        }
                    })
                    .catch(error => {
                        toast.error(error.code);
                    })
            })
            .catch(error => {
                toast.error(error.code);
            })
    }

    return (
        <div className="w-full h-screen max-h-[65rem]  flex flex-col items-center justify-center">
            <section className='w-[90%] mx-auto max-w-xl 2xl:max-w-2xl bg-[#bc8a5f] p-8 sm:p-10 md:p-12 xl:p-14 2xl:p-16 rounded-xl'>
                <h2 className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl text-center text-[#583101] hover:text-cyan-400 font-righteous font-bold mb-4 sm:mb-6">
                    WorkOrg
                </h2>
                <p className="text-sm/normal sm:text-base/normal xl:text-lg/normal 2xl:text-xl/normal text-center mb-6">
                    WebOrg – your ultimate companion for seamless task management. Organize your workflow, set priorities with ease, and maximize productivity effortlessly!
                </p>

                <div className="my-6 text-white text-left text-xs/normal xl:text-sm/normal 2xl:text-base/normal space-y-2">
                    <p>✔ Effortless drag-and-drop task management for seamless organization.</p>
                    <p>✔ Prioritize tasks with flexible, customizable ordering.</p>
                    <p>✔ Smart task categorization: To-Do, In Progress, Completed.</p>

                </div>

                <button onClick={handleLoginWithGoogle} className='w-full btn btn-outline bg-[#603808] text-white hover:bg-cyan-400 hover:text-white hover:border-none'><FaGoogle /> Login With Google</button>
            </section>
        </div>
    );
};

export default Login;