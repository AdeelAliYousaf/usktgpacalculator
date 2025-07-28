import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { animationpageout, animationpagein } from '../utils/animations';

const AniLink = ({ to, children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [playAnimation, setPlayAnimation] = useState(false);

    useEffect(() => {
        if (playAnimation) {
            animationpageout();
            setPlayAnimation(false);
        } else {
            animationpagein(); // Trigger the page-in animation on mount
        }
    }, [location.pathname, playAnimation]);

    const handleClick = (event) => {
        event.preventDefault();
        setPlayAnimation(true); // Set state to trigger the animation
        setTimeout(() => {
            navigate(to); // Navigate after setting the state
        }, 0); // Navigate immediately (or use a delay if needed)
    };

    return (
        <Link to={to} className="flex flex-col items-center" onClick={handleClick}>
            {children}
        </Link>
    );
};

export default AniLink;
