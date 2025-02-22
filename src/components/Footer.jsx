import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <section className='w-[97%] mx-auto'>
            <div className="footer footer-center p-10">
                <aside>
                    <Link
                        to="/home"
                        className={`text-2xl text-[#583101] hover:text-cyan-400 md:text-3xl font-righteous font-bold -mb-2`}
                    >
                        WorkOrg
                    </Link>
                    <p className="font-bold">
                        Streamline, Focus, and Get Things Done!
                    </p>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved. An MJ. Tanzim Development</p>
                </aside>
            </div>
        </section>
    );
};

export default Footer;