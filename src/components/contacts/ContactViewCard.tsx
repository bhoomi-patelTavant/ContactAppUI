import { Dialog, DialogContent, Box, Avatar, Typography, Paper, Stack, IconButton, DialogActions, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { type Contact } from "../../types/contact";
import { useTranslation } from "react-i18next";

interface ContactViewCardProps {
    contact: Contact | null;
    onClose: () => void;
}

export default function ContactViewCard({ contact, onClose }: ContactViewCardProps) {
    const { t } = useTranslation();
    return (
        <Dialog open={Boolean(contact)} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent>
                {contact && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ width: 56, height: 56, bgcolor: "#5b8def", fontSize: 24, fontWeight: 700 }}>
                                {contact.name.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#223750" }}>
                                    {contact.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {contact.email}
                                </Typography>
                            </Box>
                            <Box sx={{ position: "absolute", right: 8, top: 8 }}>
                                <IconButton onClick={onClose} size="small">
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Stack spacing={1.2}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Mobile No
                                    </Typography>
                                    <Typography variant="body1">{contact.mobile_no}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Country
                                    </Typography>
                                    <Typography variant="body1">{contact.country}</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onClose}>{t("cancel_btn")}</Button>
            </DialogActions>
        </Dialog>
    );
}
