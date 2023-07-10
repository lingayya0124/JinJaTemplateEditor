import { useEditor, EditorContent } from "@tiptap/react";

import "./style.css";
import { JinjaStarter } from "./JinjaStarter/JinjaStarter";
import { NodeComment } from "./NodeComment";
import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  MantineProvider,
  Paper,
  Tabs,
  TextInput,
  Text,
} from "@mantine/core";
import StarterKit from "@tiptap/starter-kit";
import { useCreateTemplate, useGetTemplates } from "./fetchers/useGetTemplate";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { RichTextEditor } from "@mantine/tiptap";
import { modals, useModals } from "@mantine/modals";
import CreateIssue from "./CreateIssue";
// import HTMLRenderer from "./HtmlRenderer";
interface Values {
  unique: string[];
  duplicates: string[];
  spacedValues: string[];
}
interface CreateForm {
  name: string;
  title: string;
  body: string;
  teams: string;
  department: string;
  tags: string[];
}
const content = "<p></p>";

export default function Editor() {
  const [variableValues, setVariableValues] = useState<Values>({} as Values);
  const [commentValues, setCommentValues] = useState<Values>({} as Values);
  const [issueVariables, setIssueVariables] = useState<any>({});

  const [isInvalidText, setIsInvalidText] = useState(false);
  const queryClient = useQueryClient();
  const createTemplate = useCreateTemplate(queryClient);
  const templates = useGetTemplates();
  console.log(templates);
  const form = useForm<CreateForm>({
    initialValues: {
      name: "",
      title: "",
      body: "",
      teams: "vlcm",
      department: "hr",
      tags: ["os:windows", "blah"],
    },
  });
  const handleCreateTemplate = async (values: CreateForm) => {
    try {
      await createTemplate.mutateAsync({
        ...values,
        body: updateHtmlString(editor?.getHTML() ?? ""),
      });
      form.reset();
      editor?.commands.setContent("");
      showNotification({
        title: "Success",
        message: `The ${values.name} template is created`,
        autoClose: 3000,
        color: "green",
      });
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: "Your request to create the Template failed",
        autoClose: 30000,
        color: "red",
      });
    }
  };
  const editor = useEditor({
    extensions: [JinjaStarter, StarterKit, NodeComment],
    content,
  });

  const handleApplyCustomMark = () => {
    editor!.chain().focus().toggleVariable("tiptap--jinja--variable").run();
  };
  const handleApplyMarkComment = () => {
    // editor!.chain().focus().setCodeBlock().run();

    editor!.chain().focus().toggleMark("tiptap--jinja--comment").run();
  };
  const handleApplyNodeComment = () => {
    editor!.chain().focus().setCodeBlock().run();

    // editor!.chain().focus().toggleMark("tiptap--jinja--comment").run();
  };
  const html = editor ? editor?.getHTML() : "";
  const doc = new DOMParser().parseFromString(html, "text/html");

  useEffect(() => {
    const getValues = (tagName: string) => {
      const elements = Array.from(doc.getElementsByTagName(tagName));
      const uniqueValues: string[] = [];
      const duplicateValues: Set<string> = new Set();
      const spacedValues: string[] = [];
      elements.forEach((element) => {
        const value = element.textContent;

        if (value && !/\s/.test(value)) {
          if (uniqueValues.includes(value)) {
            duplicateValues.add(value);
          } else {
            uniqueValues.push(value);
          }
        } else if (value && tagName === "tiptap--jinja--variable") {
          spacedValues.push(value);
        }
      });

      return {
        unique: uniqueValues,
        duplicates: Array.from(duplicateValues),
        spacedValues,
      };
    };
    const regex = /\{%([^%]+)%\}/g;
    const invalidComponents = html.match(regex);
    setIsInvalidText(invalidComponents?.length! > 0 ? true : false);
    setCommentValues(getValues("tiptap--jinja--comment"));
    setVariableValues(getValues("tiptap--jinja--variable"));
  }, [html]);

  useEffect(() => {
    if (variableValues?.spacedValues?.length > 0) {
      alert("variables has empty spaces and remove if spaced words");
    }
  }, [variableValues]);
  useEffect(() => {
    if (isInvalidText) {
      alert("You have invalid Text");
    }
  }, [isInvalidText, html]);
  console.log(isInvalidText);
  // console.log(editor?.view.state.selection.$to);
  // const handleKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     editor!.chain().focus().setHardBreak().run();
  //   }
  // };
  // console.log("variable:", variableValues.unique);
  // console.log("comment:", commentValues.unique);
  // console.log("Duplicate variables:", variableValues.duplicates);
  // console.log("Duplicate comment", commentValues.duplicates);
  // console.log("spaced", commentValues, variableValues);
  // const editor2 = useEditor({
  //   extensions: [StarterKit, JinjaStarter, NodeComment],
  //   content,
  // });
  function updateHtmlString(htmlString: string): string {
    const regexVariable =
      /(<tiptap--jinja--variable[^>]*>)(.*?)(<\/tiptap--jinja--variable>)/g;
    const regexComment =
      /(<tiptap--jinja--comment[^>]*><text>)(.*?)(<\/text><\/tiptap--jinja--comment>)/g;

    const modifiedHtmlString = htmlString
      .replace(regexVariable, "$1{{$2}}$3")
      .replace(regexComment, "$1{#$2#}$3");

    return modifiedHtmlString;
  }
  const modals = useModals();

  const handleModal = (template: any) => {
    const Modalid = modals.openModal({
      title: "Create Issue",
      size: "xl",
      centered: true,
      children: (
        <>
          <CreateIssue template={template} />
        </>
      ),
    });
  };

  return (
    <div>
      <MantineProvider theme={{ fontFamily: "Georgia, serif" }}>
        <MantineProvider theme={{ fontFamily: "Greycliff CF, sans-serif" }}>
          <Tabs defaultValue="gallery">
            <Tabs.List>
              <Tabs.Tab value="gallery">Editor</Tabs.Tab>
              <Tabs.Tab value="messages">Templates</Tabs.Tab>
              {/* <Tabs.Tab value="settings">Settings</Tabs.Tab> */}
            </Tabs.List>

            <Tabs.Panel value="gallery" pt="xs">
              <Container>
                <Box maw={320} mx="auto">
                  <form
                    onSubmit={form.onSubmit((values) => {
                      handleCreateTemplate(values);
                    })}
                  >
                    <TextInput
                      label="Name"
                      placeholder="Name"
                      {...form.getInputProps("name")}
                    />
                    <TextInput
                      label="title"
                      placeholder="Title"
                      {...form.getInputProps("title")}
                    />
                    <Paper mt={5} shadow="md" radius="md" p="sm" withBorder>
                      <Group mt={2} spacing={1}></Group>
                      <RichTextEditor editor={editor}>
                        <RichTextEditor.Toolbar sticky stickyOffset={60}>
                          <RichTextEditor.ControlsGroup>
                            <Button
                              size={"xs"}
                              mr={1}
                              onClick={handleApplyCustomMark}
                            >
                              Variable
                            </Button>
                            <Button
                              mr={1}
                              size={"xs"}
                              onClick={handleApplyMarkComment}
                            >
                              Mark
                            </Button>
                            <Button
                              mr={1}
                              size={"xs"}
                              onClick={handleApplyNodeComment}
                            >
                              Node
                            </Button>
                          </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>
                        <RichTextEditor.Content />
                      </RichTextEditor>
                      {/* <EditorContent
                        style={{ borderColor: "red" }}
                        // onKeyDown={(e) => handleKeyDown(e)}
                        editor={editor}
                      /> */}
                    </Paper>

                    <Group position="center" mt="xl">
                      <Button type="submit" variant="outline">
                        Submit
                      </Button>
                    </Group>
                  </form>
                </Box>
                {/* <Group mt={10}>
                  {variableValues?.unique?.map((variable) => (
                    <Badge variant="filled" color="red">
                      {" "}
                      {variable}{" "}
                    </Badge>
                  ))}
                </Group> */}
              </Container>
            </Tabs.Panel>

            <Tabs.Panel value="messages" pt="xs">
              <Group>
                {templates?.data?.map((element: any) => (
                  <Button
                    onClick={() => {
                      handleModal(element);
                    }}
                  >
                    Create Issue by using {element.name}
                  </Button>
                ))}
              </Group>
            </Tabs.Panel>
          </Tabs>
        </MantineProvider>
      </MantineProvider>
    </div>
  );
}
