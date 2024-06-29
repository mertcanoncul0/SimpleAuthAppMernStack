import { useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/Button";
import { DefaultInput, PasswordInput } from "../components/Input";
import { signUp } from "../service/authentication";
import { checkEmail, checkPassword, showSnackbar } from "../utils";

export const Register = () => {
    const checkboxRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    
    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        
        if (!formRef.current || !checkboxRef.current) return;

        const formData = Object.fromEntries(new FormData(formRef.current)) as { email: string, password: string, username: string };
        console.log(formData);
        
        if (!formData.username) return showSnackbar('username boş olamaz');

        if (!formData.email) return showSnackbar('email boş olamaz');
        if (!checkEmail(formData.email)) return showSnackbar('email hatalı lütfen doğru bir biçimde giriniz');

        if (!formData.password) return showSnackbar('Password boş olamaz');
        if (!checkPassword(formData.password)) return showSnackbar('şifre hatalı lütfen daha uygun bir formatta giriniz');

        if (!checkboxRef.current.checked) return showSnackbar('terms koşullarını lütfen tikleyin');

        return signUp(formData);
    }
    
    return (
        <main>
            <header className="new-header">
                <Link to='/new'>
                    <img src="/arrow.svg" alt="comeback page" />
                </Link>

                <h2>Sign Up</h2>
            </header>

            <div className="new-form-wrapper">
                <form className="new-form" ref={formRef} onKeyDown={(e) => e.key === 'Enter' ? handleRegister(e) : null}>
                    <DefaultInput type="text" placeholder="Name" name="username" />
                    <DefaultInput type="email" placeholder="Email" name="email" />
                    <PasswordInput placeholder="Password" />

                    <div>
                        <label className="checkbox-label">
                            <input type="checkbox" ref={checkboxRef} />
                            <span className="checkbox"></span>
                            <span className="terms-content">
                                By signing up, you agree to the <span className="terms">Terms of Service and Privacy Policy</span>
                            </span>
                        </label>
                    </div>

                    <Button type="register" to="#" fn={handleRegister}>Sign Up</Button>
                    <span className="form-with">Or with</span>
                    <Button type="google" to="#" fn={() => {}}>
                        <img src="/google.svg" />
                        Sign Up with Google
                    </Button>

                    <p className="already-acount-text">Already have an account? <Link to='/new/login'>Login</Link></p>
                </form>
            </div>
        </main>
    )
}