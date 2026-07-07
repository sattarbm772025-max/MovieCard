import {
  createContext,
  useContext,
} from "react";

import toast from "react-hot-toast";

const ToastContext = createContext({
  showToast: () => {},
});

export function ToastProvider({
  children,
}) {

  const showToast = (
    message,
    type = "success"
  ) => {

    if (type === "error") {
      toast.error(message);
      return;
    }

    toast.success(message);
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export default ToastContext;
