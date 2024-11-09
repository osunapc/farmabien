"use client";
import AddToCartButton from "../../components/AddToCartButton";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import React from "react";

interface Producto {
	id: number;
	imagen: string;
	nombre: string;
	laboratorio: string;
	precio: number;
}

export default function ProductosDestacados() {
	const [productos, setProductos] = useState<Producto[]>([]);
	const [busqueda, setBusqueda] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchProductos() {
			try {
				setIsLoading(true);
				setError(null);

				const { data, error } = await supabase
					.from("productos")
					.select("*")
					.gt("inventario", 0);

				if (error) {
					throw error;
				}

				if (!data || data.length === 0) {
					setError("No se encontraron productos.");
				} else {
					setProductos(data);
				}
			} catch (error) {
				setError(
					"Error al cargar los productos. Por favor, intente de nuevo más tarde."
				);
			} finally {
				setIsLoading(false);
			}
		}

		fetchProductos();
	}, []);

	const productosFiltrados = busqueda
		? productos.filter((producto) =>
				producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
		  )
		: productos.slice(0, 4);

	if (isLoading) {
		return <div className="text-center py-16">Cargando productos...</div>;
	}

	if (error) {
		return <div className="text-center py-16 text-red-600">{error}</div>;
	}

	return (
		<section className="container mx-auto px-4 py-16 text-center">
			<form className="container mx-auto my-4">
				<label
					htmlFor="busqueda"
					className="mb-2 text-sm font-medium text-gray-900 sr-only"
				>
					Buscar
				</label>
				<div className="relative">
					<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
						<svg
							className="w-4 h-4 text-gray-800"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 20 20"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							/>
						</svg>
					</div>
					<input
						id="busqueda"
						value={busqueda}
						type="text"
						className="block w-full p-4 ps-10 text-base text-gray-900 border border-gray-300 rounded-lg bg-green-200 focus:ring-green-500 focus:border-green-800"
						placeholder="Buscar tu Medicamento..."
						onChange={(e) => setBusqueda(e.target.value)}
					/>
				</div>
			</form>
			<h2 className="text-3xl font-bold mb-8 text-green-500">
				Productos Destacados
			</h2>

			{productosFiltrados.length === 0 ? (
				<p className="text-gray-600">No se encontraron productos.</p>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{productosFiltrados.map((product) => {
						const imageSrc = product.imagen || "/blank-product.webp";

						return (
							<div
								key={product.id}
								className="bg-white rounded-lg shadow-md overflow-hidden w-[cal(3rem -7vw)] flex flex-col justify-between"
							>
								<div>
                                    <a href={`/productos/${product.id}`}>
									<img
										src={imageSrc}
										alt={product.nombre}
										className="w-full object-cover"
									/>
								</a>
                                </div>
								<div className="p-4">
									<a href={`/productos/${product.id}`}>
										<h3 className="font-bold text-lg mb-2">{product.nombre}</h3>
									</a>
									<p className="text-gray-600 mb-2">{product.laboratorio}</p>
									<p className="text-red-600 font-bold mb-4">
										Bs. {product.precio.toFixed(2)}
									</p>
									<AddToCartButton
										product={{
											id: product.id,
											name: product.nombre,
											price: product.precio,
											image: product.imagen,
										}}
									/>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</section>
	);
}
