import { Alert, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { emptyContactForm, type Contact, type ContactFormState } from "../../types/contact";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useMemo, useRef, useState } from "react";
import isEqual from 'lodash/isEqual'; // Import only the required utility
import { enCountries } from "../../assets/country.en";
import { esCountries } from "../../assets/country.es";
import { deCountries } from "../../assets/country.de"
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/reduxStore";
import useApi from "../../hook/useApi";
import { useRoleStore } from "../../store/store";

interface ContactFormModalProps {
  mode: "add" | "edit" | "";
  conSelectedContact?: ContactFormState | null | undefined;
  //alert?: { type: "success" | "error"; message: string | null } | null;
  //onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  contForm?: ContactFormState;
  open: boolean;
  getAllContacts?: (action: "add" | "edit" | "delete") => void;
  totalContacts?: number;
}


function ContactFormModal({ mode, open, contForm,totalContacts, conSelectedContact, getAllContacts }: ContactFormModalProps) {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { t } = useTranslation();
  const language = useSelector((state: RootState) => state.Language.value);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string | null } | null>(null);
  const [showAlert, setShowAlert] = React.useState(alert ? true : false);
  const [openDialog, setOpenDialog] = useState(open);
  const [selectedContact, setSelectedContact] = useState<Contact | ContactFormState | null | undefined>(conSelectedContact);
  const [form, setForm] = useState<ContactFormState>(contForm || emptyContactForm);
  const [modeState, setModeState] = useState<"add" | "edit" | "">(mode);
  const { loading, request } = useApi<any>();
  const userId = useRoleStore((state) => state.userId);

  const feildDetails = {
    name: {
      error: !form.name,
      required: true,
      type: "text",
      helperText: !form.name ? t("form_helperText.name") : ""
    },
    mobileNo: {
      error: !form.mobileNo,
      required: true,
      type: "number",
      helperText: !form.mobileNo ? t("form_helperText.mobileNo") : ""
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

  useEffect(() => {
    setSelectedContact(conSelectedContact);
    setForm(contForm || emptyContactForm);
  }, [contForm, conSelectedContact]);

  useEffect(() => {
    if (selectedContact) {
      setOpenDialog(open);
    } else if (modeState === "" && mode === "add" && open == true) {
      setOpenDialog(true);
    }
  }, [selectedContact, mode, modeState, open]);

  /* useEffect(() => {
    if (mode === "add" && modeState === "add" && openDialog === false) {

    }
  }, [modeState]); */

  const countries = useMemo(() => {
    switch (language) {
      case "en":
        return enCountries;
      case "es":
        return esCountries;
      case "de":
        return deCountries;
      default:
        return enCountries
    }
  }, [language]);

  const isUpdateValue = (e: any) => {
    console.log(e);
    if (selectedContact) {
      const selectedContactData = (() => {
        const contact = selectedContact as ContactFormState;

        if ("userId" in contact) {
          const { id, userId, ...rest } = contact;
          return rest;
        }

        const { id, ...rest } = selectedContact as ContactFormState;
        return rest;
      })();

      const hasChanges = (isEqual(selectedContactData, form) || !emailRegex.test(form.email));
      return (hasChanges || isFormValid());
    } else {
      return isFormValid();
    }
  }

  const handleChange = (field: any) => (event: any) => {
    if (field === "country") {
      setForm((prev) => ({ ...prev, [field]: event?.label }));
    } else {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    }
  };

  const isFormValid = () => {
    if (!feildDetails.name.error && !feildDetails.mobileNo.error && !feildDetails.email.error && !feildDetails.country.error) {
      return false;
    } else {
      return true;
    }
  }

  const selectedCountryValue = typeof form.country === "string"
    ? countries.find((country) => country.label === form.country) ?? null
    : form.country ?? null;

  const addContact = async (newContact: Contact): Promise<Contact> => {
    try {
      const response = await request("POST", "/contacts", newContact);
      getAllContacts && getAllContacts("add");
      handleCloseDialog();
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

  const updateContact = async (updatedContact: Contact): Promise<Contact> => {
    const contactId = selectedContact?.id;
    try {
      const response = await request("PUT", `/contacts/${contactId}`, updatedContact);
      getAllContacts && getAllContacts("edit");
      handleCloseDialog();
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedContact(null);
    setForm(emptyContactForm);
    setModeState("");
  };

  const getContactDetails = (form: ContactFormState): Contact => {
    const newContact: Contact = {
      id: selectedContact?.id || (totalContacts ? totalContacts + 1 : 1),
      name: form.name.trim(),
      mobileNo: form?.mobileNo?.trim().toString(),
      email: form.email.trim(),
      country: form?.country,
      userId: userId
    };
    return newContact;
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setOpenDialog(true);
    if (!event.target.checkValidity()) {
      setAlert({ type: "error", message: "Please fill in all fields before saving and validations." });
      return;
    }

    if (mode === "edit" && selectedContact) {
      updateContact(getContactDetails(form));
    } else {
      addContact(getContactDetails(form));
    }
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: "#223750" }}>
        {mode === "add" ? t("add_contact") : t("edit_contact")}
        {showAlert && (
          <Alert severity={alert?.type} sx={{ width: "100%" }} onClose={() => setShowAlert(false)}>
            {alert?.message}
          </Alert>
        )}
        <Box sx={{ position: "absolute", right: 8, top: 8 }}>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" id="contact-form" onSubmit={handleSubmit} sx={{ mt: 1, display: "grid", gap: 2 }}>
          <TextField type={feildDetails.name.type} label={t("form_label.name")} value={form.name} name="name" onChange={handleChange("name")} required={feildDetails.name.required} fullWidth
            error={feildDetails.name.error} helperText={feildDetails.name.helperText} />
          <TextField type={feildDetails.mobileNo.type} label={t("form_label.mobileNo")} value={form.mobileNo} onChange={handleChange("mobileNo")} required={feildDetails.mobileNo.required} error={feildDetails.mobileNo.error} helperText={feildDetails.mobileNo.helperText} fullWidth />
          <TextField label={t("form_label.email")} inputRef={emailInputRef} type={feildDetails.email.type} value={form.email} onChange={handleChange("email")} required={feildDetails.email.required} error={feildDetails.email.error} helperText={feildDetails.email.helperText} fullWidth />
          {/* <TextField label="Country" value={form.country} onChange={handleChange("country")} required={feildDetails.country.required} error={feildDetails.country.error} helperText={feildDetails.country.helperText} fullWidth /> */}
          <Autocomplete
            id="country-select-demo"
            options={countries}
            autoHighlight
            value={selectedCountryValue}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            getOptionLabel={(option) => option.label}
            onChange={(_, newValue) => {
              handleChange("country")(newValue);
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
        <Button onClick={handleCloseDialog}>{t("cancel_btn")}</Button>
        <Button type="submit" form="contact-form" variant="contained" disabled={isUpdateValue(event)} sx={{ borderRadius: 999 }}>
          {mode === "add" ? t("save_contact_btn") : t("update_contact_btn")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ContactFormModal;
