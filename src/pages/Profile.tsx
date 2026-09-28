import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useRoleStore } from "../store/store";

function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userDetails = useRoleStore((state) => state.userDetails);

    const initials = userDetails.username
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "U";

    const profileRows = [
        { name: t("profile.username_label"), value: userDetails.username || "-" },
        { name: t("profile.email_label"), value: userDetails.email || "-" },
        { name: t("profile.role_label"), value: userDetails.userRole || "-" },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack spacing={3}>
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackRoundedIcon />}
                        onClick={() => navigate("/contacts")}
                        sx={{ borderRadius: 2 }}
                    >
                        {t("profile.back_button")}
                    </Button>
                </Box>

                <Paper elevation={0} sx={{ width: "100%", borderRadius: 3, border: "1px solid #e8eef7", overflow: "hidden" }}>
                    <Box
                        sx={{
                            p: 4,
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            backgroundColor: "#fafcff",
                            borderBottom: 1,
                            borderColor: "divider",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 150,
                                height: 150,
                                bgcolor: "#1976d2",
                                color: "#fff",
                                fontSize: 32,
                                fontWeight: 700,
                            }}
                        >
                            {initials}
                        </Avatar>
                      {/*   <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: "#223750" }}>
                                {userDetails.username || t("profile.unknown_user")}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
                                {userDetails.email}
                            </Typography>
                            {userDetails.userRole && (
                                <Chip
                                    label={userDetails.userRole}
                                    color="primary"
                                    size="small"
                                    sx={{ mt: 1.5, textTransform: "capitalize" }}
                                />
                            )}
                        </Box> */}
                    </Box>

                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                        <Table>
                            
                            <TableBody>
                                {profileRows.map((row) => (
                                    <TableRow key={row.name} hover>
                                        <TableCell sx={{ fontWeight: 600, color: "#223750" }}>{row.name}</TableCell>
                                        <TableCell sx={{ color: "#4b5563", wordBreak: "break-word" }}>{row.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Stack>
        </Container>
    );
}

export default Profile;
