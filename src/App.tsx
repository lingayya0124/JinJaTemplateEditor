import { MantineProvider } from "@mantine/core";
import Editor from "./Editor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <Notifications />
          <Editor />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
