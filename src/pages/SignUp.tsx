import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthForm from "../components/auth/AuthForm";
import useApi from "../hook/useApi";

function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    userRole: ""
  });
  const navigate = useNavigate();
  const { request } = useApi<any>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match" });
      return;
    }

    const registerBody = {
      "username": form.username,
      "email": form.email,
      "password": form.password,
      "fullName": form.fullName,
      "userRole": form.userRole || "User"
    }
    try {
      const response = await request("POST", "auth/register", registerBody);
      if (response.status === 201) {
        setAlert({ type: "success", message: "Account Created Successfully" });
        navigate("/login");
      } else {          
        setAlert({ type: "error", message: response.message || "Registration failed" });
        return;
      }
    }             
    catch (registerError: any) {
      const errorMessage =
                registerError?.response?.data?.message ||
                registerError?.message ||
                "Registration failed";
      setAlert({ type: "error", message: errorMessage });
    }
  };

  return (
    <AuthForm
      mode="signup"
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      alert={alert}
      footerLinkTo="/login"
    />
  );
}

export default SignUp;