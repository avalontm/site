import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import config  from "../config";

const Footer = () => {
 
  return (
    <>
    <footer className="bg-footer py-8 text-white">
      <div className="container mx-auto grid grid-cols-1 gap-6 px-6 md:grid-cols-3 md:px-12 lg:px-20">
        {/* Información del sitio */}
        <div>
          <h2 className="text-lg font-semibold">{config.title}</h2>
          <p className="mt-2 text-gray-400">
            {config.descripcion}
          </p>
        </div>

        {/* Enlaces útiles */}
        <div>
          <h3 className="text-lg font-semibold">Enlaces</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="/nosotros" className="text-gray-400 hover:text-white">¿Quienes realizaron este sitio web?</a></li>
            <li><a href="/contacto" className="text-gray-400 hover:text-white">Contacto</a></li>
            <li><a href="/faq" className="text-gray-400 hover:text-white">Preguntas Frecuentes</a></li>
          </ul>
        </div>

        {/* Redes Sociales */}
        <div>
          <h3 className="text-lg font-semibold">Síguenos</h3>
          <div className="mt-2 flex space-x-4">
            <a href="https://www.facebook.com/longplayrecordstore" className="text-2xl text-gray-400 hover:text-white"><FaFacebook /></a>
            <a href="https://www.instagram.com/longplayrecordstore" className="text-2xl text-gray-400 hover:text-white"><FaInstagram /></a>
            <a href="#" className="text-2xl text-gray-400 hover:text-white"><FaTwitter /></a>
          </div>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} AvalonTM. Todos los derechos reservados.
      </div>
    </footer>
    </>
  );

};

export default Footer;
