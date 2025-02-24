// src/components/Employee.tsx
import { useState } from "react";
import { Employee } from "../interfaces/Employee";
import { Linkedin, Github } from "lucide-react"; // Importamos los iconos

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="perspective relative h-80 w-64 cursor-pointer"
      onMouseEnter={() => setFlipped(true)} // Flip al pasar el mouse
      onMouseLeave={() => setFlipped(false)} // Regresar al frente al salir el mouse
    >
      <div
        className={`preserve-3d size-full transition-transform duration-700 ease-in-out ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Lado frontal */}
        <div className="backface-hidden absolute flex size-full flex-col items-center justify-center rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
          <img
            src={employee.photo}
            alt={employee.name}
            className="size-24 rounded-full shadow-md"
          />
          <h2 className="mt-4 break-words text-center text-lg font-bold text-gray-900 dark:text-white">
            {employee.name}
          </h2>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">{employee.role}</p>
        </div>

        {/* Lado trasero */}
        <div className="rotate-y-180 backface-hidden absolute flex size-full flex-col items-center justify-center rounded-lg bg-gray-200 p-4 shadow-lg dark:bg-gray-700">
          <p className="text-center text-sm text-gray-800 dark:text-gray-200">
            {employee.bio}
          </p>
          <a href={`mailto:${employee.email}`} className="mt-2 text-blue-500">
            {employee.email}
          </a>
          <div className="mt-2 flex gap-4">
            {employee.linkedin && (
              <a
                href={employee.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 transition-transform duration-300 hover:scale-110"
              >
                <Linkedin size={24} />
              </a>
            )}
            {employee.github && (
              <a
                href={employee.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 transition-transform duration-300 hover:scale-110 dark:text-gray-100"
              >
                <Github size={24} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
