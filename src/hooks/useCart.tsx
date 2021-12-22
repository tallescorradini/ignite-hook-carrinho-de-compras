import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    let productData;
    try {
      const { data: product } = await api.get(`/products/${productId}`);
      productData = product;
    } catch {
      toast.error("Erro na adição do produto");
      return;
    }

    const [cartItem] = cart.filter((item) => item.id === productId);

    const {
      data: { amount: amountInStock },
    } = await api.get(`/stock/${productId}`);

    let updatedCart;

    if (!cartItem) {
      if (amountInStock < 1) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      updatedCart = [...cart, { ...productData, amount: 1 }];
    } else {
      if (amountInStock < cartItem.amount + 1) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }
      updatedCart = cart.map((item) => {
        if (item.id !== cartItem.id) return item;
        return { ...item, amount: item.amount + 1 };
      });
    }

    setCart(updatedCart);
    localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
