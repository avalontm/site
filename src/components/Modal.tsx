import React from 'react';
import { XCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <XCircle />
        </button>

        <h2 className="mb-4 text-xl font-semibold text-gray-800">{title}</h2>
        <p className="mb-6 text-gray-600">{message}</p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Cancelar
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
