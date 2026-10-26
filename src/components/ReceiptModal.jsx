import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Printer, CheckCircle, ShieldAlert } from 'lucide-react';

export default function ReceiptModal({ receipt, onClose }) {
  const { lang } = useLanguage();

  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '620px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close receipt">
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem'
            }}
          >
            <CheckCircle size={28} />
          </div>
          <h2 id="receipt-title" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)' }}>
            {lang === 'te' ? 'గ్రామ పంచాయతీ ఆస్తి పన్ను అధికారిక రసీదు (డెమో)' : 'Paderu Grama Panchayat Property Tax Receipt'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
            {receipt.grama_panchayat}
          </p>
        </div>

        <div className="receipt-box">
          <div className="receipt-watermark">
            DEMO SANDBOX RECEIPT
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-300)', paddingBottom: '0.75rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--slate-500)' }}>Receipt No:</span>{' '}
              <strong>{receipt.receipt_number}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--slate-500)' }}>Date:</span>{' '}
              <strong>{receipt.payment_date}</strong>
            </div>
          </div>

          <table style={{ width: '100%', fontSize: '0.9rem', lineHeight: '1.8' }}>
            <tbody>
              <tr>
                <td style={{ color: 'var(--slate-600)', width: '45%' }}>Assessment Number:</td>
                <td><strong>{receipt.assessment_number}</strong></td>
              </tr>
              <tr>
                <td style={{ color: 'var(--slate-600)' }}>Door Number:</td>
                <td><strong>{receipt.door_number}</strong></td>
              </tr>
              <tr>
                <td style={{ color: 'var(--slate-600)' }}>Owner Name:</td>
                <td><strong>{receipt.masked_owner}</strong></td>
              </tr>
              <tr>
                <td style={{ color: 'var(--slate-600)' }}>Payment Mode:</td>
                <td>{receipt.payment_mode}</td>
              </tr>
              <tr style={{ borderTop: '2px solid var(--slate-300)', borderBottom: '2px solid var(--slate-300)' }}>
                <td style={{ color: 'var(--slate-900)', fontWeight: 800, fontSize: '1.05rem', padding: '0.5rem 0' }}>
                  Total Amount Paid:
                </td>
                <td style={{ color: 'var(--primary-700)', fontWeight: 800, fontSize: '1.2rem', padding: '0.5rem 0' }}>
                  ₹{receipt.amount_paid}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--slate-500)', textAlign: 'center', borderTop: '1px dashed var(--slate-300)', paddingTop: '0.75rem' }}>
            <p><strong>Verification Notice:</strong> {receipt.official_verification_notice}</p>
            <p>Generated digitally by Paderu Sachivalayam Portal for demonstration testing.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button className="btn btn-secondary btn-block" onClick={onClose}>
            {lang === 'te' ? 'మూసివేయండి' : 'Close'}
          </button>
          <button className="btn btn-primary btn-block" onClick={handlePrint}>
            <Printer size={16} />
            {lang === 'te' ? 'రసీదు ప్రింట్ చేయండి' : 'Print Receipt'}
          </button>
        </div>
      </div>
    </div>
  );
}
