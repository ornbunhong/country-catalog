import React from 'react';
import '../App.css';

interface CountryModalProps {
  country: Country;
  onClose: () => void;
}

const CountryModal: React.FC<CountryModalProps> = ({ country, onClose }) => {
  return (
    <div className="modal " tabIndex={-1} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{country.name.official}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Customize the content of the modal based on your needs */}
            <div>
                {Object.entries(country).map(([key, value]) => (
                    <div key={key} className="country-item">
                        <strong>{key}:</strong> {JSON.stringify(value)}
                    </div>
                ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryModal;
