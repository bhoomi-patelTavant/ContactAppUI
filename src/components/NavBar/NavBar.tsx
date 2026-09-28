import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { MenuItem, OutlinedInput, Select, type SelectChangeEvent } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux';
import { updateLanguage } from '../../redux/languageSlice';
import type { RootState, AppDispatch } from "../../store/reduxStore";
import { ProfileMenu } from "./ProfileMenu";
import { useRoleStore } from "../../store/store";

interface NavbarProps {
  onLogout: () => void;
  isLoggedIn: boolean;
}

export const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "Spanish", code: "es" },
  { label: "German", code: "de" }
];

function Navbar({ onLogout, isLoggedIn }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const lang = useSelector((state: RootState) => state.Language.value);
  const [language, setLanguage] = useState<string>(lang);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const username = useRoleStore((state) => state.userDetails.username);
  const email = useRoleStore((state) => state.userDetails.email);

  const onChangeLang = (e: SelectChangeEvent) => {
    const lang_code = e.target.value;
    setLanguage(lang_code);
    i18n.changeLanguage(lang_code);
    dispatch(updateLanguage(lang_code));
  };

  function handleLogout() {
    navigate("/login");
    onLogout();
  }

  function handleViewProfile() {
    navigate("/profile");
  }

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, []);

  return (
    <nav className="navbar">
      <h2>📒 {t("contact_app_title")}</h2>

      <div id="nav-links">

        {isLoggedIn && <NavLink to="/contacts"> {t("nav_links.contacts_link")}</NavLink>}

        {isLoggedIn && <NavLink to="/about"> {t("nav_links.about_link")}</NavLink>}

        {/*  {isLoggedIn && <NavLink to="/login" onClick={handleLogout}>
          {t("nav_links.logout_link")}
        </NavLink>} */}

        <Select
          labelId="language-label"
          id="language"
          value={language}
          input={<OutlinedInput />}
          label="Language"
          onChange={onChangeLang}
          sx={{
            marginLeft: 5,
            marginRight: 6,
            color: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Change to your preferred hover border color
            },
            // 2. Optional: Changes the border color when the select is active/focused
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Change to your preferred focused border color
            },
            '& .MuiSvgIcon-root': {
              color: 'white', // Changes the color of the arrow
            },
            // Optional: Target specifically when the select is focused or hovered
            '&:hover .MuiSvgIcon-root': {
              color: 'white', // Change to your preferred hover arrow color
            },
          }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="de">German</MenuItem>
        </Select>

        {isLoggedIn && (
          <ProfileMenu
            userName={username}
            userEmail={email}
            onViewProfile={handleViewProfile}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/*  <select defaultValue={i18n.language} onChange={onChangeLang}>
        {LANGUAGES.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select> */}
    </nav>
  );
}

export default Navbar;