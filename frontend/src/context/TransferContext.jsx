import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

const TransferContext = createContext(null);

export function TransferProvider({ children }) {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await api.getStatus();
    setState(data);
    return data;
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const check = useCallback(async () => {
    const data = await api.check();
    setState(data);
    return data;
  }, []);

  const fixDateOfExit = useCallback(async () => {
    const data = await api.fixDateOfExit();
    setState(data);
    return data;
  }, []);

  const submit = useCallback(async () => {
    const data = await api.submit();
    setState(data);
    return data;
  }, []);

  const reset = useCallback(async () => {
    const data = await api.reset();
    setState(data);
    return data;
  }, []);

  return (
    <TransferContext.Provider
      value={{ state, loading, refresh, check, fixDateOfExit, submit, reset }}
    >
      {children}
    </TransferContext.Provider>
  );
}

export function useTransfer() {
  const ctx = useContext(TransferContext);
  if (!ctx) throw new Error("useTransfer must be used within TransferProvider");
  return ctx;
}
