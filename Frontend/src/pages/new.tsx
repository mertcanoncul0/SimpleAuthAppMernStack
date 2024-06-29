import { Button } from "../components/Button";
import { ImageSlider } from "../components/ImageSlider";

export const New = () => {
    return (
        <>
            <ImageSlider />
            <div className="home-btns">
                <Button type="register" to="register" fn={() => { }}>Sign Up</Button>
                <Button type="login" to="login" fn={() => { }}>Login</Button>
            </div>
        </>
    )
}