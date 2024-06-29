import React, { useState, useRef, useEffect } from "react";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { hiddenEmail } from "../utils";
import { againSendEmail, emailVerification } from "../service/authentication";
import CountdownTimer from "../components/Counter";

const initialOtp = new Array(6).fill('');
export const Otp = () => {
    const [otp, setOtp] = useState<string[]>(initialOtp);
    const [activeOTPIndex, setActiveOtpIndex] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const [seconds, setSeconds] = useState(300); // 5 dakika = 300 saniye
    const [isActive, setIsActive] = useState(false);

    const handleSubmit = () => {
        const values: string[] = [];
        document.querySelectorAll('.otp-value').forEach((x: any) => values.push(x.textContent));
        emailVerification(values); 1
    }

    const resetTimer = () => {
        setIsActive(false);
        setSeconds(300);
    };

    function resetHandle() {
        againSendEmail();
        resetTimer();
        setIsActive(true);
    }

    const handleKey = ({ key }: any) => {
        if (key === 'Backspace') {
            if (activeOTPIndex > 0) {
                const newOtp = [...otp];
                newOtp[activeOTPIndex - 1] = '';
                setActiveOtpIndex(activeOTPIndex - 1);
                setOtp(newOtp);
            }
            return;
        }

        if (/\d/.test(key)) {
            if (activeOTPIndex !== 6) {
                console.log(key);
                const newOtp = [...otp];
                newOtp[activeOTPIndex] = key;
                console.log('key', activeOTPIndex);
                setActiveOtpIndex(activeOTPIndex + 1);
                setOtp(newOtp);
            }
            return;
        }

        if (key === "Enter") handleSubmit();
        return;
    };

    useEffect(() => {
        inputRef.current?.focus();
        window.addEventListener('keyup', handleKey);

        return () => {
            window.removeEventListener('keyup', handleKey);
        };
    }, [activeOTPIndex]);

    useEffect(() => {
        setIsActive(true);
    }, []);

    return (
        <main style={{ paddingInline: '16px' }}>
            <header className="new-header">
                <Link to='/new'>
                    <img src="/arrow.svg" alt="comeback page" />
                </Link>

                <h2>Verification</h2>
            </header>
            <h1 style={{ marginBlockStart: '195px' }}>Enter your Verification Code</h1>
            <form>
                <div className="otp-fields-wrapper" style={{ marginBlock: '3em' }}>
                    {otp.map((value, i) => (
                        <React.Fragment key={i}>
                            {value === '' ? (
                                <figure>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="17"
                                        viewBox="0 0 16 17"
                                        fill="none"
                                    >
                                        <circle cx="8" cy="8.5" r="8" fill="#E0E2E9" />
                                    </svg>
                                </figure>
                            ) : (
                                <h2 className="otp-value">{value}</h2>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <CountdownTimer seconds={seconds} setSeconds={setSeconds} isActive={isActive} setIsActive={setIsActive} />
                <p className="otp-msg">
                    We send verification code to your
                    email <span>{`${hiddenEmail(localStorage.currentEmail)}`}</span>. You can
                    check your inbox.
                </p>
                <span onClick={resetHandle} className="otp-resend">I didn’t received the code? Send again</span>
                <Button type="register" to="#" fn={handleSubmit}>Verify</Button>
            </form>
        </main>
    );
};
