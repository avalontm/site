import React from "react";
import { Helmet } from "react-helmet-async";

const pedidos = [
  { id: 70782, fecha: "20/08/2024", destino: "Sucursal", total: "$999.00 MXN", estado: "Confirmada" },
  { id: 70026, fecha: "01/08/2024", destino: "Sucursal", total: "$1,965.00 MXN", estado: "Confirmada" },
  { id: 69349, fecha: "15/07/2024", destino: "Sucursal", total: "$599.00 MXN", estado: "Confirmada" },
  { id: 68262, fecha: "18/06/2024", destino: "Sucursal", total: "$3,199.00 MXN", estado: "Confirmada" },
  { id: 67881, fecha: "08/06/2024", destino: "Sucursal", total: "$2,799.00 MXN", estado: "Confirmada" },
  { id: 67527, fecha: "29/05/2024", destino: "Sucursal", total: "$699.00 MXN", estado: "Confirmada" },
  { id: 64896, fecha: "24/03/2024", destino: "Sucursal", total: "$1,499.00 MXN", estado: "Confirmada" },
  { id: 56844, fecha: "04/11/2023", destino: "Sucursal", total: "$349.00 MXN", estado: "Confirmada" },
  { id: 46659, fecha: "31/01/2023", destino: "Sucursal", total: "$49.00 MXN", estado: "Confirmada" },
  { id: 46575, fecha: "29/01/2023", destino: "Sucursal", total: "$1,816.00 MXN", estado: "Confirmada" },
  { id: 45991, fecha: "13/01/2023", destino: "Sucursal", total: "$12,840.00 MXN", estado: "Confirmada" },
  { id: 45601, fecha: "03/01/2023", destino: "Sucursal", total: "$1,399.00 MXN", estado: "Confirmada" },
];

const Pedidos: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
        <Helmet>
            <title>Historial de pedidos</title>
        </Helmet>
      <h1 className="mb-4 text-2xl font-bold">Historial de pedidos</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Pedido #</th>
              <th className="border border-gray-300 px-4 py-2">Fecha</th>
              <th className="border border-gray-300 px-4 py-2">Enviar a</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">Estado</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">{pedido.id}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{pedido.fecha}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{pedido.destino}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{pedido.total}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-green-600">{pedido.estado}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button className="rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600">Ver pedido</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pedidos;