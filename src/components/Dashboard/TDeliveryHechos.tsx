"use client";
import React, { useState, useEffect } from "react";

import { supabase } from "../../lib/supabase";

export default function OrdersTable() {
	const [pedidos, setPedidos] = useState([]);

	useEffect(() => {
		fetchPedidos();
	}, []);

	async function fetchPedidos() {
		const { data, error } = await supabase
			.from("deliverys_aceptados")
			.select("*");
		if (error) {
			console.error("Error fetching deliverys_aceptados:", error);
		} else {
			setPedidos(data);
		}
	}

	async function handleImprimir() {
		const printWindow = window.open("", "_blank");
		printWindow.document.write(`
			<!DOCTYPE html>
			<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deliverys Entregados</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        h1 {
            margin-bottom: 20px;
            color: #333;
        }
        img {
            width: 100px; /* Ajusta el tamaño del logo según sea necesario */
            margin-bottom: 20px;
        }
        table {
            width: 80%; /* Ajusta el ancho de la tabla */
            border-collapse: collapse;
            border-radius: 10px; /* Bordes redondeados */
            overflow: hidden; /* Para que los bordes redondeados se apliquen */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra para la tabla */
        }
        th, td {
            border: 1px solid #ddd; /* Color de borde más suave */
            padding: 12px;
            text-align: center;
        }
        th {
            background-color: #4CAF50; /* Color de fondo para el encabezado */
            color: white; /* Color del texto del encabezado */
        }
        tr:nth-child(even) {
            background-color: #f2f2f2; /* Color de fondo para filas pares */
        }
        tr:hover {
            background-color: #ddd; /* Color de fondo al pasar el mouse */
        }
    </style>
</head>
<body>

    <img src="/fb_logo.svg" alt="Logo farmabien" /> <!-- Asegúrate de tener un logo en esta ruta -->
    <h1>Deliverys Entregados</h1>
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Costo de Delivery</th>
                <th>Estado</th>
                <th>Motorizado</th>
            </tr>
        </thead>
        <tbody>
            ${pedidos
							.map(
								(pedido) => `
                <tr>
                    <td>${pedido.nombre}</td>
                    <td>${pedido.direccion}</td>
                    <td>${pedido.telefono}</td>
                    <td>${pedido.deliveryCosto}</td>
                    <td>${pedido.estado}</td>
                    <td>${pedido.realizado_por}</td>
                </tr>
            `
							)
							.join("")}
        </tbody>
    </table>
</body>
</html>
		`);
		printWindow.document.close();
		printWindow.print();
	}

	async function handleEliminarPedido(id: any) {
		// Confirmar la acción
		const confirmDelete = window.confirm(
			"¿Estás seguro de que deseas eliminar el pedidos?"
		);
		if (!confirmDelete) {
			return; // Si el usuario cancela, no hacer nada
		}

		// Eliminar  registro de la tabla "aceptados"
		const { error } = await supabase.from("rechazados").delete().eq("id", id); // Eliminar solo el pedido con el ID especificado

		if (error) {
			console.error("Error eliminando el pedido:", error);
		} else {
			// Si la eliminación es exitosa, actualiza el estado local
			setPedidos([]);
			fetchPedidos();
			alert("el pedidos han sido eliminado.");
		}
	}

	return (
		<table className="min-w-full">
			<thead className="stiky">
				<tr>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Nombre
					</th>

					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Direccion
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Telefono
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Delivery costo
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Estado
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-white uppercase border-b border-gray-200 bg-green-500">
						Motorizado
					</th>
					<th className="px-6 py-3 border-b border-gray-200 bg-green-500"></th>
				</tr>
			</thead>
			<tbody className="bg-white">
				{pedidos.map((pedido) => (
					<tr key={pedido.id}>
						<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
							<div className="text-sm font-medium leading-4 text-gray-900">
								{pedido.nombre}
							</div>
						</td>
						<td className="px-4 py-4 text-sm leading-4 text-gray-500 whitespace-no-wrap border-b border-gray-200">
							{pedido.direccion}
						</td>
						<td className="px-4 py-4 text-sm leading-4 text-gray-500 whitespace-no-wrap border-b border-gray-200">
							{pedido.telefono}
						</td>
						<td className="px-4 py-4 text-sm leading-4 text-gray-500 whitespace-no-wrap border-b border-gray-200">
							{pedido.deliveryCosto}
						</td>
						<td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
							<span className="inline-flex px-2 text-xs font-semibold leading-4 text-green-100 bg-red-400 rounded-full">
								{pedido.estado}
							</span>
						</td>
						<td className="px-4 py-4 text-sm leading-4 text-gray-500 whitespace-no-wrap border-b border-gray-200">
							{pedido.realizado_por}
						</td>
						<td className="px-4 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
							<div className="flex flex-col gap-4">
								<button onClick={() => handleImprimir()}>
									<span style={{ fontSize: "30px" }}>🖨️</span>
								</button>
								<button onClick={() => handleEliminarPedido(pedido.id)}>
									<span style={{ fontSize: "30px" }}>🗑️</span>
								</button>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
