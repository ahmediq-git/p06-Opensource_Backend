import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import githubPng from '../../../static/img/github.png'
import crudPng from '../../../static/img/CRUD.png'
import { useState, useEffect } from 'react';

export default function Exposition() {
    const pictureList = [
        { name: 'CRUD', src: crudPng },
        { name: 'Realtime Database', src: '' },
        { name: 'Auth', src: '' },
        { name: 'Storage', src: '' }
    ];

    const [selectedButton, setSelectedButton] = useState('CRUD');

    const handleButtonClick = (name) => {
        setSelectedButton(name);
    };

    // For responsiveness
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1100);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 1100);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Link
                        className="large-button button button--secondary button--lg"
                        to="/docs/start-developing"
                    >
                        View Examples
                    </Link>
                    <Link
                        className="large-button button button--secondary button--lg"
                        to="/docs/intro"
                        style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}
                    >
                        <img src={githubPng} style={{ width: '30px', marginRight: '10px' }} />
                        <div>
                            GitHub Repository
                        </div>
                    </Link>

                </div>
            </div>
            <div style={{ margin: '50px 0' }}>
                <div style={{ width: '80%', margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', justifyContent: 'space-evenly' }}>
                        {/* Left Section */}
                        <div style={{ flex: 1, paddingRight: isSmallScreen ? 0 : '100px' }}>
                            <h4 className="subheading-exposition">Accelerate Your Projects: Instant APIS, Zero Hassle, All Easy!</h4>
                            <p className="paragraph-exposition">
                                Say goodbye to tedious backend setups and say hello to instant progress with EZBASE! Unlock swift development with read-made APIS for CRUD, Realtime Database, Authentication, and File Storage.
                            </p>
                        </div>

                        {/* Right Section */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                                {pictureList.map((item, index) => (
                                    <button
                                        key={index}
                                        className={`small-button button button--secondary button--lg ${selectedButton === item.name ? 'active' : ''}`}
                                        style={{ marginBottom: '5px', marginRight: '10px' }}
                                        onClick={() => handleButtonClick(item.name)}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>

                            {selectedButton && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                                    <img
                                        src={pictureList.find((item) => item.name === selectedButton)?.src || ''}
                                        alt={selectedButton}
                                        style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>





        </section >
    );
}