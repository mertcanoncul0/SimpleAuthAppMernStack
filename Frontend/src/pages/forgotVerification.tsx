import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { PasswordInput } from "../components/Input";
import { Button } from "../components/Button";
import { checkPassword, showSnackbar } from "../utils";
import { forgotPasswordVerification } from "../service/authentication";

export const ForgotVerification = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const { id } = useParams() as any;
    
    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        if (!formRef.current) return;

        const formData = Object.fromEntries(new FormData(formRef.current)) as { email: string, password: string };

        if (!formData.password) return showSnackbar('password boş olamaz');
        if (!checkPassword(formData.password)) return showSnackbar('şifre hatalıæ lütfen doğru bir biçimde giriniz');

        return forgotPasswordVerification(formData, id);
    }

    return (
        <main style={{paddingInline: '16px'}}>
            <header className="new-header">
                <Link to='/new'>
                    <img src="/arrow.svg" alt="comeback page" />
                </Link>

                <h2>Reset Password</h2>
            </header>
            

            <div className="new-form-wrapper">
                <form className="new-form" noValidate ref={formRef} onKeyDown={(e) => e.key === 'Enter' ? handleLogin(e) : null}>
                    <PasswordInput placeholder="new password" />

                    <Button type="register" to="#" fn={handleLogin}>Login</Button>
                </form>
            </div>
        </main>
    )
}

