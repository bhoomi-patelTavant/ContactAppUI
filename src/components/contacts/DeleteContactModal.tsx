import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import type { Contact } from "../../types/contact";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import useApi from "../../hook/useApi";

interface DeleteContactModalProps {
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
  getAllContacts?: (action: "add" | "edit" | "delete") => void;
}

function DeleteContactModal({ open, contact, onClose, getAllContacts }: DeleteContactModalProps) {
  const { t } = useTranslation();
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string | null } | null>(null);
  const { request } = useApi<any>();

  const deleteContact = async (): Promise<Contact> => {
    try {
      const response = await request("DELETE", `/contacts/${contact?.id}`);
      getAllContacts && getAllContacts("delete");
      return await response;
    } catch (e: any) {
      const errorMessage =
        e?.error ||
        e?.response?.data?.message ||
        e?.message;
      setAlert({ type: "error", message: errorMessage });
      throw e;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: "#223750" }}>
        {t("delete_contact")}
        <Box sx={{ position: "absolute", right: 8, top: 8 }}>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography>
          {t("delete_confirmation_msg", { name: contact?.name })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel_btn")}</Button>
        <Button color="error" variant="contained" sx={{ borderRadius: 999 }} onClick={deleteContact}>
          {t("delete_btn")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteContactModal;
