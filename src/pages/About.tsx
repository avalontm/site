import { Helmet } from "react-helmet-async";
import EmployeeCard from "../components/EmployeeCard";
import { Employee } from "../interfaces/Employee";

const employees: Employee[] = [
  {
    name: "Raul Mendez",
    role: "Desarollador Frontend/Backend",
    photo: "/assets/images/raul-mendez.jpg",
    bio: "Desarrollador con experiencia en React y TailwindCSS.",
    email: "avalontm21@gmail.com",
    linkedin: "https://linkedin.com/in/raul-mendez-754b65111",
    github: "https://github.com/avalontm",
  },
  {
    name: "Arroyo Dominguez Scarleth Yoceleth",
    role: "Ingeniera de Bases de Datos",
    photo: "/assets/images/scarleth-arroyo.jpg",
    bio: "Especialista en diseño, optimización y administración de bases de datos MySQL para aplicaciones escalables.",
    email: "scarleth.arroyo@example.com",
    linkedin: "https://linkedin.com/in/scarleth-y-a-72220b352",
    github: "https://github.com/Yoceleth",
  },
  {
    name: "Mijares Gómez Christofer",
    role: "Diseñador de Interfaz y Experiencia de Usuario",
    photo: "/assets/images/christofer-mijares.jpg",
    bio: "Encargado del diseño visual del sitio, selección de colores y experiencia de usuario.",
    email: "christofer.mijares@example.com",
    linkedin: "https://linkedin.com/in/christofermijares",
    github: "https://github.com/christofermijares",
  },
  {
    name: "Cuevas Sánchez Crisanto de Jesús",
    role: "Especialista en integración continua y despliegue automático.",
    photo: "/assets/images/crisanto-cuevas.jpg",
    bio: "Especialista en integración continua y despliegue automático.",
    email: "crisanto.cuevas@example.com",
    linkedin: "https://linkedin.com/in/crisantocuevas",
    github: "https://github.com/crisantocuevas",
  },

  {
    name: "Alejandro Renato Leon Lomeli",
    role: "Científico de Datos",
    photo: "/assets/images/alejandro-leon.jpg",
    bio: "Especialista en análisis de datos, modelado estadístico y machine learning.",
    email: "alejandro.leon@example.com",
    linkedin: "https://linkedin.com/in/alejandroleon",
    github: "https://github.com/alejandroleon",
  },
  {
    name: "Silvia Eugenia León Lomelí",
    role: "Científica de Datos",
    photo: "/assets/images/silvia-leon.jpg",
    bio: "Experta en inteligencia artificial y big data, con enfoque en la optimización de procesos.",
    email: "silvia.leon@example.com",
    linkedin: "https://linkedin.com/in/silvialeon",
    github: "https://github.com/silvialeon",
  }
];

function About() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center p-6 md:p-12 lg:p-16">
      <Helmet>
          <title>Nosotros</title>
      </Helmet>
      {/* Título y descripción */}
      <div className="mb-10 max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Nuestro Equipo de Desarrollo
        </h1>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
          Un equipo apasionado por la tecnología, creando soluciones innovadoras con las mejores herramientas del mercado.
          Somos estudiantes de la universidad del Instituto Tecnológico de Ensenada (ITE) - TecNM y realizamos esta página como parte de un proyecto del 5to semestre.
        </p>
      </div>

      {/* Tarjetas de empleados */}
      <div className="grid grid-cols-1 gap-10 px-6 sm:grid-cols-2 md:grid-cols-3 md:px-12 lg:grid-cols-3 lg:px-16">
        {employees.map((employee, index) => (
          <EmployeeCard key={index} employee={employee} />
        ))}
      </div>
    </div>
  );
}

export default About;
