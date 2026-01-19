import React, { useEffect, useState } from 'react';

interface Props {
    children: React.ReactNode;
    currentView: string; // The key triggering the transition
}

const PageTransition: React.FC<Props> = ({ children, currentView }) => {
    const [displayChildren, setDisplayChildren] = useState(children);
    const [transitionStage, setTransitionStage] = useState<'fadeIn' | 'fadeOut'>('fadeIn');

    useEffect(() => {
        setTransitionStage('fadeOut');
    }, [currentView, children]);

    useEffect(() => {
        if (transitionStage === 'fadeOut') {
            const timeoutId = setTimeout(() => {
                setTransitionStage('fadeIn');
                setDisplayChildren(children);
            }, 200); // Wait for fade out to complete

            return () => clearTimeout(timeoutId);
        }
    }, [transitionStage, children]);

    return (
        <div
            className={`transition-opacity duration-200 ease-in-out ${transitionStage === 'fadeIn' ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {displayChildren}
        </div>
    );
};

export default PageTransition;
