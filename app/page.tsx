"use client";

import {
  Button,
  Container,
  Group,
  Stack,
  Title,
  Text,
  Tooltip,
  Divider,
} from "@mantine/core";
import { useRef, useState } from "react";

const fgColors = [
  { name: "Red", code: "31", hex: "#ff5555" },
  { name: "Green", code: "32", hex: "#50fa7b" },
  { name: "Yellow", code: "33", hex: "#f1fa8c" },
  { name: "Blue", code: "34", hex: "#6272a4" },
  { name: "Magenta", code: "35", hex: "#ff79c6" },
  { name: "Cyan", code: "36", hex: "#8be9fd" },
  { name: "White", code: "37", hex: "#f8f8f2" },
];

const bgColors = [
  { name: "Dark Blue", code: "44", hex: "#0b3d91" },
  { name: "Dark Red", code: "41", hex: "#8b0000" },
  { name: "Olive", code: "43", hex: "#808000" },
  { name: "Purple", code: "45", hex: "#800080" },
  { name: "Dark Cyan", code: "46", hex: "#008b8b" },
  { name: "Gray", code: "47", hex: "#a9a9a9" },
  { name: "Beige", code: "103", hex: "#f5f5dc" },
];

export default function HomePage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [currentStyle, setCurrentStyle] = useState<
    Partial<CSSStyleDeclaration>
  >({});

  const applyStyleToSelectionOrTyping = (
    newStyle: Partial<CSSStyleDeclaration>
  ) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const mergedStyle = { ...currentStyle, ...newStyle };
    setCurrentStyle(mergedStyle);

    document.execCommand("styleWithCSS", false, "true");

    if (newStyle.color) {
      document.execCommand("foreColor", false, newStyle.color);
    }
    if (newStyle.backgroundColor) {
      document.execCommand("backColor", false, newStyle.backgroundColor);
    }
    if (newStyle.fontWeight === "bold") {
      document.execCommand("bold");
    }
    if (newStyle.textDecoration === "underline") {
      document.execCommand("underline");
    }
  };

  const rgbToHex = (rgb: string) => {
    const result = rgb
      .match(/\d+/g)
      ?.map((v) => parseInt(v).toString(16).padStart(2, "0"));
    return result ? `#${result.join("")}` : "";
  };

  const handleCopy = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const result: string[] = [];
    let prevAnsi = "";

    const walk = (node: ChildNode | HTMLElement) => {
      if (node.nodeType === Node.TEXT_NODE) {
        result.push(node.textContent || "");
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const style = getComputedStyle(el);
        const codes = [];

        const fgHex = rgbToHex(style.color);
        const bgHex = rgbToHex(style.backgroundColor);

        const fg = fgColors.find(
          (c) => c.hex.toLowerCase() === fgHex.toLowerCase()
        );
        if (fg) codes.push(fg.code);

        const bg = bgColors.find(
          (c) => c.hex.toLowerCase() === bgHex.toLowerCase()
        );
        if (bg) codes.push(bg.code);

        if (style.fontWeight === "700" || style.fontWeight === "bold")
          codes.push("1");
        if (style.textDecoration.includes("underline")) codes.push("4");

        const currentAnsi = `\u001b[${codes.join(";")}m`;

        if (currentAnsi !== prevAnsi && codes.length > 0) {
          result.push(currentAnsi);
          prevAnsi = currentAnsi;
        }

        el.childNodes.forEach(walk);

        if (codes.length > 0) {
          result.push("\u001b[0m");
          prevAnsi = "";
        }
      }
    };

    editor.childNodes.forEach(walk);

    const ansiString = "```ansi\n" + result.join("") + "\n```";
    navigator.clipboard.writeText(ansiString);
  };

  const resetAll = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    setCurrentStyle({});
  };

  return (
    <Container size="md" pt="xl">
      <Title align="center" mb="lg">
        Discord Text Editor
      </Title>

      <Group position="center" mb="xs">
        <Button onClick={resetAll}>Reset</Button>
        <Button
          onClick={() => applyStyleToSelectionOrTyping({ fontWeight: "bold" })}
        >
          Bold
        </Button>
        <Button
          onClick={() =>
            applyStyleToSelectionOrTyping({ textDecoration: "underline" })
          }
        >
          Underline
        </Button>
      </Group>

      <Stack spacing="xs">
        <Group spacing="xs">
          <Text>FrontGround Color:</Text>
          {fgColors.map((color) => (
            <Tooltip label={color.name} key={color.code}>
              <Button
                onClick={() =>
                  applyStyleToSelectionOrTyping({ color: color.hex })
                }
                style={{ backgroundColor: color.hex, width: 24, height: 24 }}
              />
            </Tooltip>
          ))}
        </Group>

        <Group spacing="xs">
          <Text>BackGround Color:</Text>
          {bgColors.map((color) => (
            <Tooltip label={color.name} key={color.code}>
              <Button
                onClick={() =>
                  applyStyleToSelectionOrTyping({ backgroundColor: color.hex })
                }
                style={{
                  backgroundColor: color.hex,
                  width: 24,
                  height: 24,
                  border: "1px solid #888",
                }}
              />
            </Tooltip>
          ))}
        </Group>
      </Stack>

      <Divider my="lg" />

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          backgroundColor: "#1e1e1e",
          padding: "1rem",
          borderRadius: 8,
          minHeight: "120px",
          fontFamily: "monospace",
          color: "#fff",
          whiteSpace: "pre-wrap",
        }}
      />

      <Button fullWidth mt="md" onClick={handleCopy}>
        Copy text as Discord formatted
      </Button>
    </Container>
  );
}
