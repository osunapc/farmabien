import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
	id: number;
	name: string;
	price: number;
	quantity: number;
	image: string;
}

interface CartStore {
	items: CartItem[];
	addItem: (item: Omit<CartItem, "quantity">) => void;
	removeItem: (id: number) => void;
	updateQuantity: (id: number, quantity: number) => void;
	clearCart: () => void;
	total: () => number;
	getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],
			addItem: (item) => {
				set((state) => {
					const existingItem = state.items.find((i) => i.id === item.id);
					if (existingItem) {
						return {
							items: state.items.map((i) =>
								i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
							),
						};
					}
					return { items: [...state.items, { ...item, quantity: 1 }] };
				});
			},
			removeItem: (id) => {
				set((state) => ({
					items: state.items.filter((item) => item.id !== id),
				}));
			},
			updateQuantity: (id, quantity) => {
				set((state) => ({
					items: state.items.map((item) =>
						item.id === id ? { ...item, quantity } : item
					),
				}));
			},
			getSubtotal: () => {
				const { items } = get();
				const subtotal = items.reduce(
					(total, item) => total + item.price * item.quantity,
					0
				);

				return subtotal;
			},
			clearCart: () => {
				set({ items: [] });
			},
			total: () => {
				const subtotal = get().getSubtotal();

				return subtotal;
			},
		}),
		{
			name: "cart-storage",
		}
	)
);
