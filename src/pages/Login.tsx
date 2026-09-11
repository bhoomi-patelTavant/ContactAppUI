import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthForm from "../components/auth/AuthForm";
import useApi from "../hook/useApi";
import { useRoleStore } from "../store/store";

interface LoginProps {
    onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const navigate = useNavigate();
    const { loading, request } = useApi<any>();
    //const { setUserRole } = useUserRoleContext();
    const setUserRole = useRoleStore((state) => state.setUserRole);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const loginBody = {
            "username": form.username,
            "password": form.password
        }
        try {
            const response = await request("POST", "/users/login", loginBody);
            if (response.status !== 200) {
                setAlert({ type: "error", message: response.message || "Login failed" });
                return;
            }
            setUserRole(response.data.user_role);
            sessionStorage.setItem("isLoggedIn", "true");
            setAlert({ type: "success", message: "Login successful" });
            onLogin();
            navigate("/contacts");
        } catch (loginError: any) {
            const errorMessage =
                loginError?.error ||
                loginError?.response?.data?.message ||
                loginError?.message ||
                "Login failed";

            sessionStorage.setItem("isLoggedIn", "false");
            setAlert({ type: "error", message: errorMessage });
        }
    }

    return (
        <AuthForm
            mode="login"
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            alert={alert}
            footerLinkTo="/signup"
            showRememberMe
            isLoading={loading}
        />
    );
}

export default Login;