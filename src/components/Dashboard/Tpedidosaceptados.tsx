"use client";
import React, { useState, useEffect } from "react";

import { supabase } from "../../lib/supabase";

export default function OrdersTable() {
	const [pedidos, setPedidos] = useState([]);

	useEffect(() => {
		fetchPedidos();
	}, []);

	async function fetchPedidos() {
		const { data, error } = await supabase.from("aceptados").select("*");
		if (error) {
			console.error("Error fetching pedidos:", error);
		} else {
			setPedidos(data);
		}
	}

		async function handleImprimir() {
			const printWindow = window.open("", "_blank");
			printWindow.document.write(`
			<!DOCTYPE html>
			<html>
				<head>
					<title>Imprimir Pedidos</title>
					<style>
						table {
							width: 100%;
							border-collapse: collapse;
						}
						th, td {
							border: 1px solid black;
							padding: 8px;
							text-align: center;
						}
						th {
							background-color: #f2f2f2;
						}
					</style>
				</head>
				<body>
					<h1>Pedidos</h1>
					<table>
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Producto</th>
								<th>Direccion</th>
								<th>Telefono</th>
								<th>TipoDePago</th>
								<th>NumeroDeReferencia</th>
								<th>Delivery costo</th>
								<th>Total</th>
								<th>Fecha</th>
								<th>Estado</th>
							</tr>
						</thead>
						<tbody>
							${pedidos
								.map(
									(pedido) => `
								<tr>
									<td>${pedido.nombre}</td>
									<td>${pedido.productos
										.map(
											(producto) =>
												`${producto.name} (Unids: ${producto.quantity})`
										)
										.join("<br>")}</td>
									<td>${pedido.direccion}</td>
									<td>${pedido.telefono}</td>
									<td>${pedido.tipoDePago}</td>
									<td>${pedido.numeroDeReferencia}</td>
									<td>${pedido.deliveryCosto}</td>
									<td>Bs.${pedido.total}</td>
									<td>${pedido.fecha}</td>
									<td>${pedido.estado}</td>
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
		const { error } = await supabase.from("aceptados").delete().eq("id", id); // Eliminar solo el pedido con el ID especificado

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
						Producto
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Direccion
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Telefono
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						TipoDePago
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						NumeroDeReferencia
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Delivery costo
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Total
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Fecha
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Estado
					</th>
					<th className="px-6 py-3 border-b border-gray-200 bg-green-500"></th>
				</tr>
			</thead>
			<tbody className="bg-white">
				{pedidos.map((pedido) => (
					<tr key={pedido.id}>
						<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
							<div className="text-sm font-medium leading-4 text-gray-900">
								{pedido.nombre}
							</div>
						</td>
						<td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
							<div className="text-sm leading-4 text-gray-900">
								{pedido.productos.map((producto, index) => (
									<div key={index}>
										{producto.name}
										<div>Unids {producto.quantity}</div>
									</div>
								))}
							</div>
						</td>
						<td className="px-4 py-4 text-sm leading-4 text-gray-500 whitespace-no-wrap border-b border-gray-200">
							{pedido.direccion}
						</td>
						<td className="px-4 py-4 text-sm leading-4 text-gray-500 whitespace-no-wrap border-b border-gray-200">
							{pedido.telefono}
						</td>
						<td className="px-4 py-4 text-sm leading-4 text-gray-500 whitespace-no-wrap border-b border-gray-200">
							{pedido.tipoDePago}
						</td>
						<td className="px-4 py-4 text-sm leading-4 text-gray-500 whitespace-no-wrap border-b border-gray-200">
							{pedido.numeroDeReferencia}
						</td>
						<td className="px-4 py-4 text-sm leading-4 text-gray-500 whitespace-no-wrap border-b border-gray-200">
							{pedido.deliveryCosto}
						</td>
						<td className="px-4 py-4 text-sm leading-4 text-gray-500 whitespace-no-wrap border-b border-gray-200">
							Bs.<strong>{pedido.total}</strong>{" "}
						</td>
						<td className="px-4 py-4 text-sm leading-4 text-gray-500 whitespace-no-wrap border-b border-gray-200">
							{pedido.fecha}
						</td>
						<td className="px-4 py-4 whitespace-no-wrap border-b border-gray-200">
							<span className="inline-flex px-2 text-xs font-semibold leading-4 text-green-800 bg-green-100 rounded-full">
								{pedido.estado}
							</span>
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
