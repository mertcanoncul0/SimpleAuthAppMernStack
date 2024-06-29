import { useState } from "react";

export const DefaultInput = ({placeholder, type, name}: { placeholder: string, type: string, name: string }) => {
    return (
        <div className="form-control">
            <input type={type} placeholder={placeholder} name={name} required />
        </div>
    )
}

export const PasswordInput = ({placeholder}: { placeholder: string }) => {
    const [isShow, setShow] = useState(false);
    const changeIcon = () => setShow(!isShow);

    return (
        <div className="password form-control">
            <input type={isShow ? 'text' : 'password'} placeholder={placeholder} name="password" required />
            {isShow ? (<img src="/eye-slash.svg" onClick={changeIcon} />) : (<img src="/eye.svg" onClick={changeIcon} />)}
        </div>
    )
}