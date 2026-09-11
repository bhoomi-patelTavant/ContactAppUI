import React from 'react';
import './Spinner.css';

type SpinnerProps = {
  show?: boolean;
  message?: string;
};

export const Spinner: React.FC<SpinnerProps> = ({ show = true, message }) => {
  if (!show) return null;

  return (
    <div className="spinner-overlay" role="status" aria-live="polite">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="spinner"></div>
        {message ? <p className="spinner-text">{message}</p> : null}
      </div>
    </div>
  );
};