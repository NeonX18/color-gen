"use client";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body suppressHydrationWarning={true}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
