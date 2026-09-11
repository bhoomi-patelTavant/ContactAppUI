import { Alert, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import type { FormEvent } from "react";
import type { ContactFormState } from "../../types/contact";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useMemo, useRef } from "react";
import isEqual from 'lodash/isEqual'; // Import only the required utility
import { enCountries } from "../../assets/country.en";
import { esCountries } from "../../assets/country.es"
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/reduxStore";

interface ContactFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  form: ContactFormState;
  selectedContact?: ContactFormState | null | undefined;
  alert?: { type: "success" | "error"; message: string | null } | null;
  onClose: () => void;
  onChange: (field: any) => (value: any) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function ContactFormModal({ open, mode, form, alert, onClose, onChange, onSubmit, selectedContact }: ContactFormModalProps) {
  const [showAlert, setShowAlert] = React.useState(alert ? true : false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { t } = useTranslation();
  const language = useSelector((state: RootState) => state.Language.value);
  const feildDetails = {
    name: {
      error: !form.name,
      required: true,
      type: "text",
      helperText: !form.name ? t("form_helperText.name") : ""
    },
    mobile_no: {
      error: !form.mobile_no,
      required: true,
      type: "number",
      helperText: !form.mobile_no ? t("form_helperText.mobile_no") : ""
    },
    email: {
      error: !form.email || !emailRegex.test(form.email),
      required: true,
      type: "email",
      helperText: !form.email || !emailRegex.test(form.email) ? !form.email ? t("form_helperText.email_required") : t("form_helperText.email_format") : ""
    },
    country: {
      error: !form.country,
      required: true,
      type: "text",
      helperText: !form.country ? t("form_helperText.country") : ""
    },
  }

  useEffect(() => {
    if (alert) {
      setShowAlert(true);
    } else {
      setShowAlert(false)
    }
  }, [alert]);

  const countries = useMemo(() => {
    switch (language) {
      case "en":
        return enCountries;
      case "es":
        return esCountries;
      default:
        return enCountries
    }
  }, [language]);

  const isUpdateValue = (e: any) => {
    console.log(e);
    if (selectedContact) {
      const { id, user_id, ...selectedContactData } = selectedContact;
      const hasChanges = (isEqual(selectedContactData, form) || !emailRegex.test(form.email));
      return (hasChanges || isFormValid());
    } else {
      return isFormValid();
    }
  }

  const isFormValid = () => {
    if (!feildDetails.name.error && !feildDetails.mobile_no.error && !feildDetails.email.error && !feildDetails.country.error) {
      return false;
    } else {
      return true;
    } 
  }

  const selectedCountryValue = typeof form.country === "string"
    ? countries.find((country) => country.label === form.country) ?? null
    : form.country ?? null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: "#223750" }}>
        {mode === "add" ? t("add_contact") : t("edit_contact")}
        {showAlert && (
          <Alert severity={alert?.type} sx={{ width: "100%" }} onClose={() => setShowAlert(false)}>
            {alert?.message}
          </Alert>
        )}
        <Box sx={{ position: "absolute", right: 8, top: 8 }}>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" id="contact-form" onSubmit={onSubmit} sx={{ mt: 1, display: "grid", gap: 2 }}>
          <TextField type={feildDetails.name.type} label={t("form_label.name")} value={form.name} name="name" onChange={onChange("name")} required={feildDetails.name.required} fullWidth
            error={feildDetails.name.error} helperText={feildDetails.name.helperText} />
          <TextField type={feildDetails.mobile_no.type} label={t("form_label.mobile_no")} value={form.mobile_no} onChange={onChange("mobile_no")} required={feildDetails.mobile_no.required} error={feildDetails.mobile_no.error} helperText={feildDetails.mobile_no.helperText} fullWidth />
          <TextField label={t("form_label.email")} inputRef={emailInputRef} type={feildDetails.email.type} value={form.email} onChange={onChange("email")} required={feildDetails.email.required} error={feildDetails.email.error} helperText={feildDetails.email.helperText} fullWidth />
          {/* <TextField label="Country" value={form.country} onChange={onChange("country")} required={feildDetails.country.required} error={feildDetails.country.error} helperText={feildDetails.country.helperText} fullWidth /> */}
          <Autocomplete
            id="country-select-demo"
            options={countries}
            autoHighlight
            value={selectedCountryValue}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            getOptionLabel={(option) => option.label}
            onChange={(_, newValue) => {
              onChange("country")(newValue);
            }}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img
                  loading="lazy"
                  width="20"
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  alt=""
                />
                {option.label} ({option.code}) +{option.phone}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                name="country"
                label={t("form_label.country")}
                type={feildDetails.country.type}
                required={feildDetails.country.required}
                error={feildDetails.country.error}
                helperText={feildDetails.country.helperText}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel_btn")}</Button>
        <Button type="submit" form="contact-form" variant="contained" disabled={isUpdateValue(event)} sx={{ borderRadius: 999 }}>
          {mode === "add" ? t("save_contact_btn") : t("update_contact_btn")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ContactFormModal;
