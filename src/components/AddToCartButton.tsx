// @ts-nocheck

import React from "react";
import { useCartStore } from "../store/cartStore";

interface Product {
	id: number;
	name: string;
	price: number;
	image: string;
}

interface Props {
	product: Product;
}

export default function AddToCartButton({ product }: Props) {
	const addItem = useCartStore((state) => state.addItem);

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault(); // Prevenir navegación si el botón está dentro de un enlace
		addItem({
			id: product.id,
			name: product.name,
			price: product.price,
			image: product.image,
			quantity: 1,
		});
		alert("Producto agregado al carrito");
	};

	return (
		<button
			onClick={handleAddToCart}
			className="w-full bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg transition-colors"
		>
			Agregar al Carrito
		</button>
	);
}
