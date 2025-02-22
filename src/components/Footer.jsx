import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <section className='w-[97%] mx-auto'>
            <div className="footer footer-center p-10">
                <aside>
                    <Link
                        to="/home"
                        className={`text-2xl text-[#3b82f6] md:text-3xl font-righteous font-bold -mb-2`}
                    >
                        TaskNest
                    </Link>
                    <p className="font-bold">
                        TaskNest
                        <br />
                        Organize, Prioritize, and Achieve More!
                    </p>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                </aside>
            </div>
        </section>
    );
};

export default Footer;