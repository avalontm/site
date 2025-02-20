import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Importa los estilos de Quill

export interface EditorHtmlProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EditorHtml: React.FC<EditorHtmlProps> = ({ name, value, onChange }) => {
  const handleChange = (content: string) => {
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
        onChange={handleChange} // Usar la función modificada
        theme="snow"
        className="rounded-lg border border-gray-300 bg-white text-gray-900"
      />
    </div>
  );
};

export default EditorHtml;
