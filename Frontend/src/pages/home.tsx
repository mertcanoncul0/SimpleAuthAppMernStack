import { useLoaderData, useNavigate } from "react-router-dom";
import { showSnackbar } from "../utils";

export const Home = () => {
    const response = useLoaderData() as Record<string, any>;
    const navigate = useNavigate();
    
    console.log(response);

    function logout() {
        localStorage.removeItem('sessionToken');
        showSnackbar('Çıkış Yapılıyor...')
        setTimeout(() => {
            navigate('/new');
        }, 1500);
    }

    return (
        <>
            {<button onClick={logout}>Çıkış Yap</button>}
            <div>
                {response.user?.username}
            </div>
        </>
    )
}