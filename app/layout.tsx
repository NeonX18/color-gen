import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";

export const metadata = {
  title: "Discord Text Editor",
  description: "Custom Discord color generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme: "dark" }} // or 'light' or dynamic
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
