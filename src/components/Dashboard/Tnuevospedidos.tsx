"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function OrdersTable() {
	const [pedidos, setPedidos] = useState([]);

	useEffect(() => {
		fetchPedidos();

		// Configurar el canal de Supabase para escuchar cambios en tiempo real
		const channel = supabase
			.channel("table-db-changes")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "pedidos",
				},
				(payload) => {
					console.log("Cambio recibido:", payload);
					fetchPedidos();
				}
			)
			.subscribe();

		// Limpiar la suscripción cuando el componente se desmonte
		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	async function fetchPedidos() {
		const { data, error } = await supabase.from("pedidos").select("*");
		if (error) {
			console.error("Error al obtener pedidos:", error);
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
						deliveryCosto: pedido.deliveryCosto,
						estado: false,
					},
				])
				.select();

			const res = await supabase.from("pedidos").delete().eq("id", pedido.id);

			alert("Pedido enviado, el motorizado recibirá una alerta");
			// Ya no es necesario llamar a fetchPedidos() aquí, ya que la actualización en tiempo real se encargará de ello
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

			const res = await supabase.from("pedidos").delete().eq("id", pedido.id);

			alert("Pedido enviado a la página de rechazados");
			// Ya no es necesario llamar a fetchPedidos() aquí, ya que la actualización en tiempo real se encargará de ello
		} catch (error) {
			console.error("Error al rechazar el pedido:", error);
		}
	}

	return (
		<table className="min-w-full">
			<thead className="sticky">
				<tr>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Nombre
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Producto
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Dirección
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Teléfono
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Tipo de Pago
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Número de Referencia
					</th>
					<th className="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-white uppercase border-b border-gray-200 bg-green-500">
						Costo de Delivery
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
