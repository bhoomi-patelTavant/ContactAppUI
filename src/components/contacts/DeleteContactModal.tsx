import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import type { Contact } from "../../types/contact";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

interface DeleteContactModalProps {
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteContactModal({ open, contact, onClose, onConfirm }: DeleteContactModalProps) {
  const { t } = useTranslation();
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
        <Button color="error" variant="contained" sx={{ borderRadius: 999 }} onClick={onConfirm}>
          {t("delete_btn")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteContactModal;
