import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

type AuthMode = "login" | "signup";

interface AuthFormProps {
    mode: AuthMode;
    form: {
        username?: string;
        email?: string;
        fullName?: string;
        password: string;
        confirmPassword?: string;
        userRole?: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    alert?: { type: "success" | "error"; message: string } | null;
    footerLinkTo: string;
    showRememberMe?: boolean;
    isLoading?: boolean;
}

function AuthForm({
    mode,
    form,
    onChange,
    onSubmit,
    alert,
    footerLinkTo,
    showRememberMe = false,
    isLoading = false,
}: AuthFormProps) {
    const isLogin = mode === "login";
    const [showAlert, setShowAlert] = React.useState(alert ? true : false);
    const { t } = useTranslation();
    const convFooterText = isLogin ? t("login.footerText") : t("login.signup_footerText");
    const convFooterLinkText = isLogin ? t("login.footerLinkText") : t("login.submitLabel");
    const convSubmitLabel = isLogin ? t("login.submitLabel") : t("login.signin_label")

    const userRoles = [
        { id: 1, label: t("sign_up_role.super_admin") },
        { id: 2, label: t("sign_up_role.admin") },
        { id: 3, label: t("sign_up_role.user") },
    ];

    useEffect(() => {
        if (alert) {
            setShowAlert(true);
        }   
    }, [alert]);

    return (
        <Container maxWidth="sm" sx={{maxWidth : "500px !important"}}>
            <Paper
                sx={{
                    mt: 8,
                    p: 5,
                    borderRadius: 3,
                    marginBottom: 10,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ bgcolor: "primary.main", mb: 2 }}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h4">
                        {isLogin ? t("login.signin_label") : t("login.create_account_label")}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {isLogin
                            ? t("login.login_desc")
                            : t("login.create_account_desc")}
                    </Typography>

                    {showAlert && (
                        <Alert severity={alert?.type} sx={{ width: "100%", mb: 2 }} onClose={() => setShowAlert(false)}>
                            {alert?.message}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={onSubmit} sx={{ width: "100%" }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="username"
                            label= {t("login.username_label")}
                            type="text"
                            required
                            value={form.username || ""}
                            onChange={onChange}
                            disabled={isLoading}
                        />

                        {!isLogin && (
                            <TextField
                                fullWidth
                                margin="normal"
                                name="fullName"
                                label={t("login.fullName_label")}
                                type="text"
                                required
                                value={form.fullName || ""}
                                onChange={onChange}
                                disabled={isLoading}
                            />
                        )}

                        {!isLogin && (
                            <TextField
                                fullWidth
                                margin="normal"
                                name="email"
                                label={t("login.email_label")}
                                type="text"
                                required
                                value={form.email}
                                onChange={onChange}
                                disabled={isLoading}
                            />
                        )}

                        <TextField
                            fullWidth
                            margin="normal"
                            label={t("login.password_label")}
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={onChange}
                            disabled={isLoading}
                        />

                        {!isLogin && (
                            <TextField
                                fullWidth
                                margin="normal"
                                label={t("login.confirm_password_label")}
                                name="confirmPassword"
                                type="password"
                                required
                                value={form.confirmPassword || ""}
                                onChange={onChange}
                                disabled={isLoading}
                            />
                        )}

                        {!isLogin && (
                            <Autocomplete
                                options={userRoles}
                                getOptionLabel={(option) => option.label}
                                onChange={(event, newValue) => {
                                    onChange({
                                        target: {
                                            name: "userRole",
                                            value: newValue ? newValue.label : "",
                                        },
                                    } as React.ChangeEvent<HTMLInputElement>);
                                    console.log(event);
                                }}
                                value={
                                    form.userRole
                                        ? userRoles.find((role) => role.label === form.userRole) || null
                                        : null
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label={t("login.role_label")} />
                                )}
                            />
                        )}      

                        {showRememberMe && (
                            <FormControlLabel control={<Checkbox disabled={isLoading} />} label={t("login.remember_me_label")} />
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 2, py: 1.5 }}
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {convSubmitLabel}
                        </Button>

                        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                {convFooterText}
                                <Link to={footerLinkTo} style={{ marginLeft: 4 }}>
                                    {convFooterLinkText}
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default AuthForm;
