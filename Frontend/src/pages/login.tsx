import { useRef } from "react";
import { Link } from "react-router-dom";
import { DefaultInput, PasswordInput } from "../components/Input";
import { Button } from "../components/Button";
import { showSnackbar } from "../utils";
import { checkEmail } from "../utils";
import { signIn } from "../service/authentication";

export const Login = () => {
    const formRef = useRef<HTMLFormElement>(null);
    
    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        
        if (!formRef.current) return;

        const formData = Object.fromEntries(new FormData(formRef.current)) as { email: string, password: string };

        if (!formData.email) return showSnackbar('email boş olamaz');
        if (!checkEmail(formData.email)) return showSnackbar('email hatalı lütfen doğru bir biçimde giriniz');

        if (!formData.password) return showSnackbar('Password boş olamaz');

        return signIn(formData);
    }

    return (
        <main style={{paddingInline: '16px'}}>
            <header className="new-header">
                <Link to='/new'>
                    <img src="/arrow.svg" alt="comeback page" />
                </Link>

                <h2>Login</h2>
            </header>

            <div className="new-form-wrapper">
                <form className="new-form" onKeyDown={(e) => e.key === 'Enter' ? handleLogin(e) : null} noValidate ref={formRef}>
                    <DefaultInput type="email" placeholder="Email" name="email" />
                    <PasswordInput placeholder="Password" />

                    <Button type="register" to="#" fn={handleLogin}>Login</Button>
                    <Link to='/new/forgot' className="forgot-password">Forgot Password?</Link>
                    <br />
 
                    <p className="already-acount-text">Don’t have an account yet? <Link to='/new/register'>Sign Up</Link></p>
                </form>
            </div>
        </main>
    )
}

