"use client";

import { ThemeProvider } from "./theme-provider";
import { ReduxProvider } from "./redux-provider";
import { ModalProvider } from "./modal-provider";
import { GlobalVarProvider } from "./global-var-provider";
import { AuthProvider } from "./auth-provider";
import { Toaster } from "../ui/sonner";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class">
      <ReduxProvider>
        <GlobalVarProvider>
          <ModalProvider />
          <AuthProvider />
          <Toaster />
          {children}
        </GlobalVarProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
