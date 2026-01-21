import React, { useEffect, useState } from 'react';

interface Props {
    children: React.ReactNode;
    currentView: string; // The key triggering the transition
}

const PageTransition: React.FC<Props> = ({ children, currentView }) => {
    const [displayChildren, setDisplayChildren] = useState(children);
    const [transitionStage, setTransitionStage] = useState<'fadeIn' | 'fadeOut'>('fadeIn');
    const prevViewRef = React.useRef(currentView);

    useEffect(() => {
        if (currentView !== prevViewRef.current) {
            // View changed: Animate
            prevViewRef.current = currentView;
            setTransitionStage('fadeOut');

            const timeoutId = setTimeout(() => {
                setTransitionStage('fadeIn');
                setDisplayChildren(children);
            }, 200);

            return () => clearTimeout(timeoutId);
        } else {
            // View did not change (just props/children update): Update immediately without animation
            setDisplayChildren(children);
        }
    }, [currentView, children]);

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
