// context/OrderContext.tsx
import React, { createContext, useContext, useState } from "react";

type OrderContextType = {
  orderCount: number;
  ordercount: number;
  setOrderCount: (count: number) => void;
  setCount: (count: number) => void;
};

const OrderContext = createContext<OrderContextType>({
  orderCount: 0,
  ordercount: 0,
  setOrderCount: () => {},
  setCount: () => {},
});

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orderCount, setOrderCount] = useState(0);
  const [ordercount, setCount] = useState(0);

  return (
    <OrderContext.Provider value={{ orderCount, setOrderCount, ordercount, setCount }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
