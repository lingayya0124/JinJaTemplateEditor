import { MantineProvider } from "@mantine/core";
import Editor from "./Editor";
export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Editor />
    </MantineProvider>
  );
}
