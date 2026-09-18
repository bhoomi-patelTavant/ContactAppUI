import "./About.css";
import { useSelector } from "react-redux";
import type { RootState } from "../store/reduxStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const About = () => {
  const { t, i18n } = useTranslation();
  const lang = useSelector((state: RootState) => state.Language.value);
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const navigateToSearch = () => {
    navigate("/contacts?focus=true");
  }

  const addContact = () => {
    navigate("/contacts?addContact=true");
  }

  return (
    <div className="about-page">
      <div className="about-card">
        <h1> {t("about.contct_app_title")}</h1>d2
        <p className="tagline">
          {t("about.contact_app_description")}
        </p>

        <section className="about-section">
          <h2>{t("about.app_title")}</h2>
          <p>
            {t("about.app_description")}
          </p>
        </section>

        <section className="about-section">
          <h2>✨ {t("about.features")}</h2>
          <div className="features">
            <div className="feature-card" onClick={addContact} >
              <span>➕</span>
              <h3>{t("about.add_contact_title")}</h3>
              <p>{t("about.add_contact_desc")}</p>
            </div>

              <div className="feature-card disable-section" aria-disabled="true">
                <span>✏️</span>
                <h3>{t("about.edit_contact_title")}</h3>
                <p>{t("about.edit_contact_desc")}</p>
              </div>

            <div className="feature-card" onClick={navigateToSearch} style={{ cursor: "pointer" }}>
              <span>🔍</span>
              <h3>{t("about.search_contact_title")}</h3>
              <p>{t("about.search_contact_desc")}</p>
            </div>

            <div className="feature-card disable-section">
              <span>🗑️</span>
              <h3>{t("about.delete_contact_title")}</h3>
              <p>{t("about.delete_contact_desc")}</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>🛠️ {t("about.technologies_used")}</h2>
          <div className="tech-list">
            <span>React.js</span>
            <span>TypeScript</span>
            <span>React Router</span>
            <span>CSS3</span>
            <span>Bootstrap</span>
          </div>
        </section>

        <section className="about-section">
          <h2>🎯 {t("about.our_mission_title")}</h2>
          <p>
            {t("about.our_mission_desc")}
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;