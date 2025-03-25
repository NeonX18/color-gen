"use client";

import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body suppressHydrationWarning={true}>
        <MantineProvider
          defaultColorScheme="dark"
          withGlobalStyles
          withNormalizeCSS
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
