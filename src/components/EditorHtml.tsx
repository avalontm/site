import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Importa los estilos de Quill

export interface EditorHtmlProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean; // Agregar la propiedad disabled opcional
}

const EditorHtml: React.FC<EditorHtmlProps> = ({ name, value, onChange, disabled = false }) => {
  const handleChange = (content: string) => {
    if (disabled) return; // Evita cambios si está deshabilitado

    // Simular un evento para que sea compatible con handleInputChange
    const event = {
      target: { name, value: content },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    onChange(event);
  };

  return (
    <div className="w-full">
      <ReactQuill
        value={value}
        onChange={handleChange}
        theme="snow"
        className="min-h-[150px] rounded-lg border border-gray-300 bg-white text-gray-900"
        readOnly={disabled} // Usar readOnly para deshabilitar edición
      />
    </div>
  );
};

export default EditorHtml;
