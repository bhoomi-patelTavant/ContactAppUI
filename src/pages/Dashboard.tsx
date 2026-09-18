import { useState, useEffect, useRef } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import ContactFormModal from "../components/contacts/ContactFormModal";
import DeleteContactModal from "../components/contacts/DeleteContactModal";
import ContactViewCard from "../components/contacts/ContactViewCard";
import { emptyContactForm, type Contact, type ContactFormState } from "../types/contact";
import useApi from "../hook/useApi";
import { useRoleStore } from "../store/store";
import { useTranslation } from "react-i18next";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { enUS, esES, deDE } from "@mui/x-data-grid/locales";
import { useSelector } from "react-redux";
import type { RootState } from "../store/reduxStore";
import { Spinner } from '../components/spinner/Spinner';
import { useSearchParams } from "react-router-dom";

/* const initialContacts: Contact[] = [
  {
    id: 1,
    name: "Aisha Khan",
    address: "12 River Street",
    mobileNo: "+1 555 0142",
    email: "aisha.khan@example.com",
    city: "New York",
  },
  {
    id: 2,
    name: "Daniel Ortiz",
    address: "89 Maple Avenue",
    mobileNo: "+1 555 0187",
    email: "daniel.ortiz@example.com",
    city: "Chicago",
  },
  {
    id: 3,
    name: "Mina Patel",
    address: "44 Green Road",
    mobileNo: "+1 555 0114",
    email: "mina.patel@example.com",
    city: "Austin",
  },
]; */

function Dashboard() {
  const [contacts, setContacts] = useState<any>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "">("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [viewContact, setViewContact] = useState<Contact | null>(null);
  const [form, setForm] = useState<ContactFormState>(emptyContactForm);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string | null } | null>(null);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  //const { userRole } = useUserRoleContext();
  const userRole = useRoleStore((state) => state.userRole);
  const userId = useRoleStore((state) => state.userId);
  const { loading, request } = useApi<any>();
  const [isLoading, setIsLoading] = useState<boolean>(loading);
  const { t, i18n } = useTranslation();
  const lang = useSelector((state: RootState) => state.Language.value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const theme = createTheme(
    {},
    i18n.language === "en" ? enUS : i18n.language === "es" ? esES : deDE
  );

  useEffect(() => {
    getAllContacts();
    console.log(alert);
  }, []);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("focus") === "true") {
      inputRef.current?.focus();
    } else if (searchParams.get("addContact") === "true") {
      handleOpenAdd();
    }
  }, [searchParams]);

  const filteredContacts = () => {
    if (!searchQuery) {
      return contacts;
    } else {
      const filtered = contacts.filter((contact: any) =>
        contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.mobileNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.country?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return filtered;
    }
  };

  const getAllContacts = async (operation?: string): Promise<Contact[]> => {
    try {
      const response = await request("GET", `/contacts/user/${userId}`);
      setContacts(response.data);
      if (operation !== "add" && operation !== "edit" && operation !== "delete") {
        setFeedback({ type: "success", message: t("alert_meassages.get_all_contacts") });
      } else {
        if (operation === "add") {
          setFeedback({ type: "success", message: t("alert_meassages.save_contact") });
        } else if (operation === "edit") {
          setFeedback({ type: "success", message: t("alert_meassages.update_contact") });
        } else if (operation === "delete") {
          setFeedback({ type: "success", message: t("alert_meassages.delete_contact") });
        }
      }
      return response;
    } catch (e: any) {
      setFeedback({ type: "error", message: t("alert_meassages.error_contact") });
      throw e;
    }
  };

  const deleteContact = async (): Promise<Contact> => {
    try {
      const response = await request("DELETE", `/contacts/${deleteTarget?.id}`);
      setFeedback({ type: "success", message: t("alert_meassages.delete_contact") });
      getAllContacts("delete");
      setDeleteTarget(null);
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

  const handleOpenAdd = () => {
    setMode("add");
    setSelectedContact(null);
    setForm(emptyContactForm);
    setOpenDialog(true);
    setFeedback(null);
    setAlert(null);
  };

  const handleOpenEdit = (contact: Contact) => {
    setMode("edit");
    setOpenDialog(true);
    setSelectedContact(contact);
    setAlert(null);
    setForm({
      name: contact?.name,
      mobileNo: contact?.mobileNo?.toString(),
      email: contact?.email,
      country: contact?.country,
    });
    setFeedback(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedContact(null);
    setForm(emptyContactForm);
  };

  const handleOpenView = (contact: Contact) => {
    setViewContact(contact);
  };

  const handleCloseView = () => {
    setViewContact(null);
  };

  const translateRows = async (
    rows: Contact[],
    language: string,
    isAlertMsg: boolean,
    text?: string
  ): Promise<string | string[] | Contact[] | undefined> => {
    if (isAlertMsg === false) {
      setIsLoading(true);
      return Promise.all(
        rows.map(async (row) => ({
          ...row,
          name: await translateResponse(row.name, language),
          email: await translateResponse(row.email, language),
          mobileNo: await translateResponse(row.mobileNo, language),
          country: await translateResponse(row.country, language),
        }))
      ).then((translatedRows) => {
        setIsLoading(false);
        return translatedRows;
      });
    } else {
      if (text) {
        setIsLoading(true);
        translateResponse(text, language)
          .then((translatedText) => {
            setIsLoading(false);
            setAlertMsg(translatedText);
            return translatedText;
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  const translateResponse = async (text: string, language: string): Promise<string> => {
    try {
      const requestBody = {
        q: text,
        target: language,
        format: "text",
      };
      const API_KEY = "AIzaSyABLYQ1NTENm5yZza7nFsZITxga-Q_Dp8Q";
      const response = await request("POST", `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, requestBody);
      const translatedText = response.data.translations[0].translatedText;
      return translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      return text;
    }
  };

  useEffect(() => {
    i18n.changeLanguage(lang);
    const loadRows = async () => {
      const translated = await translateRows(filteredContacts(), lang, false);
      setContacts(translated);
      if (feedback?.message !== null && feedback?.message !== undefined && feedback?.message !== "") {
        await translateRows(filteredContacts(), lang, true, feedback?.message);
      }
    };
    loadRows();
  }, [lang, feedback?.message]);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) {
      return;
    }
    setContacts((prev: any) => prev.filter((contact: any) => contact.id !== deleteTarget.id));
    deleteContact();
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("data-grid-header.name"),
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 2 }}>
          <Avatar sx={{ width: 38, height: 38, bgcolor: "#5b8def", fontWeight: 700 }}>
            {String(params.row.name).charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#223750" }}>
              {t(params.row.name)}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { field: "mobileNo", headerName: t("data-grid-header.mobileNo"), flex: 0.8, minWidth: 140 },
    { field: "email", headerName: t("data-grid-header.email"), flex: 1.2, minWidth: 220 },
    {
      field: "country", headerName: t("data-grid-header.country"), flex: 0.8, minWidth: 120
    },
    {
      field: "actions",
      headerName: t("data-grid-header.actions"),
      sortable: false,
      filterable: false,
      minWidth: 350,
      renderCell: (params) => {
        if (userRole !== "Admin" && userRole !== "Super Admin") {
          return (
            <Stack direction="row" spacing={1} sx={{ whiteSpace: "nowrap", alignItems: "center", py: 2 }}>
              <Button size="small" sx={{ color: "#2563eb", textTransform: "none" }} startIcon={<ViewIcon />} onClick={() => handleOpenView(params.row as Contact)}>
                {t("view_btn")}
              </Button>
            </Stack>
          );
        }
        return (
          <Stack direction="row" spacing={1} sx={{ whiteSpace: "nowrap", alignItems: "center", py: 2 }}>
            <Button size="small" sx={{ color: "#2563eb", textTransform: "none" }} startIcon={<ViewIcon />} onClick={() => handleOpenView(params.row as Contact)}>
              {t("view_btn")}
            </Button>
            <Button size="small" sx={{ color: "#2563eb", textTransform: "none" }} startIcon={<EditIcon />} onClick={() => handleOpenEdit(params.row as Contact)}>
              {t("edit_btn")}
            </Button>
            <Button size="small" color="error" sx={{ textTransform: "none" }} startIcon={<DeleteIcon />} onClick={() => setDeleteTarget(params.row as Contact)}>
              {t("delete_btn")}
            </Button>
          </Stack>
        )
      },
    },
  ];

  const showSpinner = loading || isLoading;

  return (
    <Box sx={{ position: 'relative' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {userRole === "Admin" || userRole === "Super Admin" ? (
            <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
              <Button variant="contained" sx={{ borderRadius: 999, px: 2.5, py: 1 }} startIcon={<AddIcon />} onClick={handleOpenAdd}>
                {t("add_contact")}
              </Button>
            </Box>
          ) : null}


          {feedback && (
            <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
              {alertMsg}
            </Alert>
          )}

          <Paper elevation={0} sx={{ width: "100%", overflow: "hidden", borderRadius: 3, border: "1px solid #e8eef7" }}>
            <Box sx={{ p: 2.5, borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fafcff", gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#223750" }}>
                {t("contact_list")}
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
                <TextField
                  placeholder={t("serach_placeholder")}
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  inputRef={inputRef}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: 350,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                    },
                  }}
                />
                <Chip label={`${filteredContacts().length}` + " " + t("contacts")} color="primary" variant="outlined" sx={{ borderRadius: 999 }} />
              </Box>
            </Box>

            <Box sx={{ height: 420, width: "100%" }}>
              <ThemeProvider theme={theme}>
                <DataGrid
                  rows={filteredContacts() ?? []}
                  columns={columns ?? []}
                  getRowId={(row) => row.id}
                  pageSizeOptions={[5, 10]}
                  initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                  rowHeight={72}
                  sx={{
                    border: 0,
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#f7faff",
                      color: "#223750",
                      fontWeight: 700,
                      borderBottom: "1px solid #e5ecf8",
                      minHeight: 56,
                    },
                    "& .MuiDataGrid-row:hover": { backgroundColor: "#f9fbff" },
                    "& .MuiDataGrid-cell": {
                      alignItems: "center",
                      paddingTop: 0,
                      paddingBottom: 0,
                      whiteSpace: "nowrap",
                    },
                    "& .MuiDataGrid-cellContent": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    "& .MuiDataGrid-columnSeparator": {
                      display: "none",
                    },
                    "& .MuiTablePagination-root": {
                      color: "#223750",
                      fontWeight: 500,
                      overflow: "hidden",
                    },
                    "& .MuiTablePagination-toolbar": {
                      minHeight: 56,
                      padding: "0 16px",
                      borderTop: "1px solid #e8eef7",
                    },
                    "& .MuiTablePagination-select": {
                      marginRight: 2,
                      paddingBottom: "10px !important"
                    },
                    "& .MuiTablePagination-input": {
                      paddingBottom: "10px !important"
                    },
                    "& .MuiTablePagination-selectIcon": {
                      paddingBottom: "12px",
                      display: "none"
                    },
                    "& .MuiTablePagination-actions": {
                      paddingBottom: "20px"
                    }
                  }}
                />
              </ThemeProvider>
            </Box>
          </Paper>
        </Stack>

        <ContactFormModal
          open={openDialog}
          mode={mode}
          contForm={form}
          conSelectedContact={selectedContact}
          getAllContacts={getAllContacts}
          totalContacts={contacts.length}
        />

        <DeleteContactModal
          open={Boolean(deleteTarget)}
          contact={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />

        <ContactViewCard contact={viewContact} onClose={handleCloseView} />
      </Container>

      <Spinner show={showSpinner} message="" />
    </Box>
  );
}

export default Dashboard;
