import React from 'react';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  content,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-container">
        <div className="confirm-modal-header">
          <h3>{title}</h3>
        </div>
        <div className="confirm-modal-content">
          <p>{content}</p>
        </div>
        <div className="confirm-modal-footer">
          <button className="cancel-button" onClick={onCancel}>取消</button>
          <button className="confirm-button" onClick={onConfirm}>确认</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 