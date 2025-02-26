import React from "react";

const Ubicacion: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-4 text-2xl font-bold">Nuestra Ubicación</h1>
      <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Dirección</h2>
        <p className="text-gray-700">Av. Delante 277, Buenaventura, 22880 Ensenada, B.C.</p>
      </div>
      <div className="overflow-hidden rounded-lg shadow-lg">
        <iframe
          title="Ubicación"
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3359.032680736752!2d-116.59966291976019!3d31.851884713851117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d8d3f3b4c5b1ef%3A0x9f7c6f3d7b1e6c5!2sAv.%20Delante%20277%2C%20Buenaventura%2C%2022880%20Ensenada%2C%20B.C.!5e0!3m2!1ses-419!2smx!4v1708978800000"
        ></iframe>
      </div>
    </div>
  );
};

export default Ubicacion;