"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import { supabase } from "../lib/supabase";

const deliveryZones = [
	{ id: 1, name: "Zona 1", price: 2 },
	{ id: 2, name: "Zona 2", price: 3 },
	{ id: 3, name: "Zona 3", price: 5 },
];

export default function CartAndCheckout() {
	const { items, removeItem, updateQuantity, clearCart, total } =
		useCartStore();
	const [phone, setPhone] = useState("");
	const [loading, setLoading] = useState(false);
	const [selectedZone, setSelectedZone] = useState(deliveryZones[0]);
	const [direccion, setdireccion] = useState(""); // Added direccion state
	const [nombre, setnombre] = useState(""); // Added nombre state
	const [paymentReference, setPaymentReference] = useState(""); //Added in update
	const [tipoDePago, settipoDePago] = useState(""); //Added in update

	useEffect(() => {}, [total, items]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (items.length === 0) {
			alert("Tu carrito está vacío");
			return;
		}

		try {
			// Crear el pedido
			const { data: pedidoData, error: pedidoError } = await supabase
				.from("pedidos")
				.insert([
					{
						productos: items,
						nombre: nombre,
						direccion: direccion,
						telefono: phone,
						deliveryCosto: selectedZone.price,
						total: finalTotal,
						tipoDePago: tipoDePago,
						numeroDeReferencia: paymentReference,
						estado: "pending",
						fecha: new Date().toISOString(),
					},
				])
				.select();

			if (pedidoError) {
				throw new Error(`Error al crear el pedido: ${pedidoError.message}`);
			}

			// Actualizar el inventario de cada producto
			const updatePromises = items.map(async (item) => {
				const { error: updateError } = await supabase
					.from("productos")
					.update({ inventario: item.quantity - 1 }) // Resta 1 al inventario
					.eq("id", item.id); // Asegúrate de actualizar el producto correcto

				if (updateError) {
					throw new Error(
						`Error al actualizar el inventario: ${updateError.message}`
					);
				}
			});

			// Espera a que todas las actualizaciones se completen
			await Promise.all(updatePromises);

			console.log(pedidoData);
			alert("¡Pedido realizado con éxito!");
			// clearCart();
			// window.location.href = "/";
		} catch (error) {
			console.error("Error al procesar el pedido:", error);
			alert("Error al procesar el pedido");
		} finally {
			setLoading(false);
		}
	};

	const subTotal = total();
	const deliveryCost = selectedZone.price;
	const finalTotal = subTotal + deliveryCost;

	if (items.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-600">Tu carrito está vacío</p>
				<a
					href="/productos"
					className="text-primary hover:underline mt-4 inline-block"
				>
					Ver productos
				</a>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div>
					<h2 className="text-2xl font-bold mb-4">Tu Carrito</h2>
					{items.map((item) => (
						<div
							key={item.id}
							className="flex items-center gap-4 border-b py-4"
						>
							<img
								src={item.image}
								alt={item.name}
								className="w-24 h-24 object-cover rounded"
							/>
							<div className="flex-grow">
								<h3 className="font-bold">{item.name}</h3>
								<p className="text-primary">Bs {item.price.toFixed(2)}</p>
								<div className="flex items-center gap-2 mt-2">
									<label>Cantidad:</label>
									<select
										value={item.quantity}
										onChange={(e) => {
											const newQuantity = parseInt(e.target.value);
											updateQuantity(item.id, newQuantity);
										}}
										className="border rounded px-2 py-1"
									>
										{[1, 2, 3, 4, 5].map((num) => (
											<option key={num} value={num}>
												{num}
											</option>
										))}
									</select>
								</div>
							</div>
							<button
								onClick={() => {
									removeItem(item.id);
								}}
								className="text-red-500 hover:text-red-700"
							>
								X
							</button>
						</div>
					))}
				</div>

				<div>
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

						<div className="mb-6">
							<p className="flex justify-between mb-2">
								<span>Subtotal:</span>
								<span>Bs {subTotal.toFixed(2)}</span>
							</p>
							<div className="flex justify-between mb-2">
								<span>Zona de Delivery:</span>
								<select
									value={selectedZone.id}
									onChange={(e) =>
										setSelectedZone(
											deliveryZones.find(
												(zone) => zone.id === parseInt(e.target.value)
											) || deliveryZones[0]
										)
									}
									className="border rounded px-2 py-1"
								>
									{deliveryZones.map((zone) => (
										<option key={zone.id} value={zone.id}>
											{zone.name} - Bs {zone.price.toFixed(2)}
										</option>
									))}
								</select>
							</div>
							<p className="flex justify-between mb-2">
								<span>Costo de Delivery:</span>
								<span>Bs {deliveryCost.toFixed(2)}</span>
							</p>
							<p className="flex justify-between font-bold text-lg">
								<span>Total:</span>
								<span>Bs {finalTotal.toFixed(2)}</span>
							</p>
						</div>

						<div className="mb-6">
							<h3 className="font-bold mb-2">Instrucciones de Pago</h3>
							<p className="text-sm text-gray-600 mb-2">
								Realiza el pago a través de:
							</p>
							<ul className="text-sm text-gray-600 list-disc list-inside mb-4">
								<li>Yape: 999-999-999</li>
								<li>Plin: 999-999-999</li>
								<li>BCP: 123-456-789</li>
							</ul>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">
									Nombre completo
								</label>
								<input
									type="text"
									required
									value={nombre}
									onChange={(e) => setnombre(e.target.value)}
									className="w-full border rounded-lg px-3 py-2"
									placeholder="Ejemplo: Maria Perez"
								/>
							</div>{" "}
							<div>
								<label className="block text-sm font-medium mb-1">
									Dirección exacta
								</label>
								<input
									type="text"
									required
									value={direccion}
									onChange={(e) => setdireccion(e.target.value)}
									className="w-full border rounded-lg px-3 py-2"
									placeholder="Ejemplo: Calle Principal #123, Apto 4B"
								/>
							</div>{" "}
							{/* Added direccion input */}
							<div>
								<label className="block text-sm font-medium mb-1">
									Teléfono de contacto
								</label>
								<input
									type="tel"
									required
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className="w-full border rounded-lg px-3 py-2"
									placeholder="Ejemplo: 04140000000"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Tipo de Pago
								</label>
								<select
									required
									value={tipoDePago}
									onChange={(e) => settipoDePago(e.target.value)}
									className="w-full border rounded-lg px-3 py-2"
								>
									<option value="">Selecciona el tipo de pago</option>
									<option value="Yape">Zelle</option>
									<option value="Plin">Pago movil</option>
									<option value="BCP">Transferencia</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Número de Referencia de Pago
								</label>
								<input
									type="text"
									required
									value={paymentReference}
									onChange={(e) => setPaymentReference(e.target.value)}
									className="w-full border rounded-lg px-3 py-2"
									placeholder="Ingresa el número de referencia del pago"
								/>
							</div>
							<button
								type="submit"
								disabled={loading}
								className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
							>
								{loading ? "Procesando..." : "Confirmar Pedido"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
