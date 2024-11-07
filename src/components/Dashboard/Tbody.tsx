"use client";
import React, { useState, useEffect } from "react";

import { supabase } from "../../lib/supabase";

export default function OrdersTable() {
	const [pedidos, setPedidos] = useState([]);

	useEffect(() => {
		fetchPedidos();
	}, []);

	async function fetchPedidos() {
		const { data, error } = await supabase.from("pedidos").select("*");
		if (error) {
			console.error("Error fetching pedidos:", error);
		} else {
			setPedidos(data);
		}
	}

	async function handleAceptar(pedido) {
		try {
			const { data, error } = await supabase
				.from("aceptados")
				.insert([
					{
						id: pedido.id,
						productos: pedido.productos,
						nombre: pedido.nombre,
						direccion: pedido.direccion,
						telefono: pedido.telefono,
						deliveryCosto: pedido.deliveryCosto,
						total: pedido.total,
						tipoDePago: pedido.tipoDePago,
						numeroDeReferencia: pedido.numeroDeReferencia,
						estado: "aceptado",
						fecha: pedido.fecha,
					},
				])
				.select();

			const { error: errorDelivery } = await supabase
				.from("delivery")
				.insert([
					{
						nombre: pedido.nombre,
						telefono: pedido.telefono,
						direccion: pedido.direccion,
						estado: false,
					},
				])
				.select();

			alert("Pedido enviado, el motorizado recibirá una alerta");
			fetchPedidos(); // Refresh the list after accepting
		} catch (error) {
			console.error(error);
		}
	}

	async function handleRechazar(pedido) {
		try {
			const { data: rechazados, error } = await supabase
				.from("rechazados")
				.insert([
					{
						id: pedido.id,
						productos: pedido.productos,
						nombre: pedido.nombre,
						direccion: pedido.direccion,
						telefono: pedido.telefono,
						deliveryCosto: pedido.deliveryCosto,
						total: pedido.total,
						tipoDePago: pedido.tipoDePago,
						numeroDeReferencia: pedido.numeroDeReferencia,
						estado: "rechazado",
						fecha: pedido.fecha,
					},
				])
				.select();
			alert("Pedido enviado a la pagina rechazados");
			fetchPedidos(); // Refresh the list after rejecting
		} catch (error) {
			console.error("Error rejecting order:", error);
		}
	}

	return (
		<table className="min-w-full">
			<thead className="stiky">
				<tr>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
						Nombre
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
						Producto
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
						Direccion
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
						Telefono
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
						TipoDePago
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
						NumeroDeReferencia
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
						Delivery costo
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
						Total
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
						Fecha
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
						Estado
					</th>
					<th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
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
								<button onClick={() => handleAceptar(pedido)}>
									<span style={{ fontSize: "30px" }}>👍</span>
								</button>
								<button onClick={() => handleRechazar(pedido)}>
									<span style={{ fontSize: "30px" }}>⛔</span>
								</button>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
