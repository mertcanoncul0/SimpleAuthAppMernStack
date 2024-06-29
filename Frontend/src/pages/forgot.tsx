import { useRef } from "react";
import { Link } from "react-router-dom";
import { DefaultInput } from "../components/Input";
import { Button } from "../components/Button";
import { showSnackbar } from "../utils";
import { checkEmail } from "../utils";
import { forgotPassword } from "../service/authentication";

export const ForgotPassword = () => {
    const formRef = useRef<HTMLFormElement>(null);
    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        if (!formRef.current) return;

        const formData = Object.fromEntries(new FormData(formRef.current)) as { email: string, password: string };

        if (!formData.email) return showSnackbar('email boş olamaz');
        if (!checkEmail(formData.email)) return showSnackbar('email hatalıæ lütfen doğru bir biçimde giriniz');

        return forgotPassword(formData);
    }

    return (
        <main style={{ paddingInline: '16px' }}>
            <header className="new-header">
                <Link to='/new'>
                    <img src="/arrow.svg" alt="comeback page" />
                </Link>

                <h2>Forgot Password</h2>
            </header>

            <h1 className="forgot-head" style={{ marginBlock: '69px 46px' }}>
                Don’t worry.Enter your email and we’ll send you a link to reset your password.
            </h1>

            <div className="new-form-wrapper">
                <form className="new-form" noValidate ref={formRef} onKeyDown={(e) => e.key === 'Enter' ? handleLogin(e) : null}>
                    <DefaultInput type="email" placeholder="Email" name="email" />

                    <Button type="register" to="#" fn={handleLogin}>Login</Button>
                </form>
            </div>
        </main>
    )
}

