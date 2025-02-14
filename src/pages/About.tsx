//src/pages/About.tsx
import EmployeeCard from "../components/EmployeeCard";
import { Employee } from "../interfaces/Employee";

const employees: Employee[] = [
  {
    name: "Raul Mendez",
    role: "Frontend Developer",
    photo: "https://avatars.githubusercontent.com/u/23564932?v=4",
    bio: "Desarrollador con experiencia en React y TailwindCSS.",
    email: "avalontm21@gmail.com",
    linkedin: "https://linkedin.com/in/avalontm",
    github: "https://github.com/avalontm",
  },
  {
    name: "Arroyo Dominguez Scarleth Yocelet",
    role: "Software Engineer",
    photo: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    bio: "Desarrolladora de software con experiencia en JavaScript y Python.",
    email: "scarleth.arroyo@example.com",
    linkedin: "https://linkedin.com/in/scarletharroyo",
    github: "https://github.com/scarletharroyo",
  },
  {
    name: "Cuevas Sánchez Crisanto de Jesús",
    role: "DevOps Engineer",
    photo: "https://i.pravatar.cc/150?u=a042581f3e29016705d",
    bio: "Especialista en integración continua y despliegue automático.",
    email: "crisanto.cuevas@example.com",
    linkedin: "https://linkedin.com/in/crisantocuevas",
    github: "https://github.com/crisantocuevas",
  },
  {
    name: "Mijares Gómez Christofer",
    role: "Data Scientist",
    photo: "https://i.pravatar.cc/150?u=a042581f4e290265043",
    bio: "Experto en análisis de datos y aprendizaje automático.",
    email: "christofer.mijares@example.com",
    linkedin: "https://linkedin.com/in/christofermijares",
    github: "https://github.com/christofermijares",
  },
];
 
function About() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-gray-100 p-12 dark:bg-gray-900">
      {/* Título y descripción */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Nuestro Equipo de Desarrollo
        </h1>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
          Un equipo apasionado por la tecnología, creando soluciones innovadoras con las mejores herramientas del mercado.
        </p>
      </div>

      {/* Tarjetas de empleados */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {employees.map((employee, index) => (
          <EmployeeCard key={index} employee={employee} />
        ))}
      </div>
    </div>
  );
}

export default About;
