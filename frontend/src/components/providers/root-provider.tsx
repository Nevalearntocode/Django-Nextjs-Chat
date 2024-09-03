"use client";

import { ThemeProvider } from "./theme-provider";
import { ReduxProvider } from "./redux-provider";
import { ModalProvider } from "./modal-provider";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class">
      <ReduxProvider>
        <ModalProvider />
        {children}
      </ReduxProvider>
    </ThemeProvider>
  );
}
