import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import React, { useEffect, useRef } from 'react';

// Register the TextPlugin
gsap.registerPlugin(TextPlugin);

interface StepperProps {
    isMobilePayInfo: boolean;
    handlePrev?: () => void;
    setIsMobilePayInfo?: (isMobilePayInfo: boolean) => void;
    startText: string;
    endText: string;
}

const Stepper: React.FC<StepperProps> = ({ isMobilePayInfo, startText, endText,setIsMobilePayInfo }) => {
    const progressBarRef = useRef<HTMLDivElement>(null);
    // const startTextRef = useRef<HTMLDivElement>(null);
    const endTextRef = useRef<HTMLDivElement>(null);
    const borderDivRef = useRef<HTMLDivElement>(null);
    const innerCircleRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (progressBarRef.current && isMobilePayInfo) {
            gsap.to(progressBarRef.current, {
                width: `100%`,
                duration: 0.6,
            });
        }
        if (endTextRef.current && borderDivRef.current && innerCircleRef && isMobilePayInfo) {
            gsap.to(endTextRef.current, {
                color: '#00B152',
                duration: .5,
                delay: .5,
                ease: "power2.inOut"
            });
            gsap.to(borderDivRef.current, {
                borderColor: '#00B152',
                delay: .5,
                duration: 0.5
            });
            gsap.to(innerCircleRef.current, {
                display: 'block',
                delay: .8,
                duration: 0.5
            })
        }
    }, [isMobilePayInfo]);
    return (
        <div className="w-full py-4 px-8 dark:bg-[#151515] bg-white">
            <div className='flex justify-center items-center'>
            <>
                {isMobilePayInfo ? (
                    <div className='rounded-full  bg-[#00B152] w-[20px] h-[20px] flex justify-center items-center' onClick={() => setIsMobilePayInfo && setIsMobilePayInfo(false)}>
                        <img src="/icons/tick.svg" alt="" />
                    </div>
                ) :
                    <div className='rounded-full border-2 border-[#00B152] w-[20px] h-[20px] flex justify-center items-center'>
                        <div className='rounded-full  bg-[#00B152] w-[10px] h-[10px]' />
                    </div>
                }
            </>
                <div className="w-2/3 h-[3px] bg-[#ABB7C2] rounded-full overflow-hidden">
                    <div
                        ref={progressBarRef}
                        className="h-full bg-[#00B152] transition-all duration-300 ease-out"
                        style={{ width: '0%' }}
                    ></div>
                </div>
                <div ref={borderDivRef} className='rounded-full border-2 border-[#AAB7C2] w-[20px] h-[20px] flex justify-center items-center'>
                    <div ref={innerCircleRef} className='rounded-full bg-[#00B152] hidden w-[10px] h-[10px]' />
                </div>
            </div>
            <div className='flex justify-between'>
                <div className="text-[0.89rem] text-[#00B152]" onClick={() => setIsMobilePayInfo && setIsMobilePayInfo(false)}>
                    {startText}
                </div>
                <div
                    ref={endTextRef}
                    className='text-[0.89rem] text-[#ABB7C2]'
                >
                    {endText}
                </div>
            </div>
        </div>
    );
};

export default Stepper;