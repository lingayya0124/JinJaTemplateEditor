import { Box, Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { useCreateIssue } from "./fetchers/useGetTemplate";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import { modals } from "@mantine/modals";

function CreateIssue({ template }: any) {
  const queryClient = useQueryClient();
  const createTemplate = useCreateIssue(queryClient);

  const obj = template.variables.reduce(
    (acc: any, key: string) => ({ ...acc, [key]: "" }),
    {}
  );
  const form = useForm<any>({
    initialValues: obj,
  });
  const handleCreateIssue = async (values: any) => {
    try {
      await createTemplate.mutateAsync({
        unique_id: template.unique_id,
        formData: { context: values },
      });
      showNotification({
        title: "Success",
        message: `The ${values.name} issue is created`,
        autoClose: 3000,
        color: "green",
      });
      modals.closeAll();
      form.reset();
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: "Your request to create the Issue failed",
        autoClose: 30000,
        color: "red",
      });
    }
  };
  return (
    <div>
      {" "}
      <Box maw={320} mx="auto">
        <form
          onSubmit={form.onSubmit((values) => {
            handleCreateIssue(values);
            // handleCreateTemplate(values);
          })}
        >
          {template.variables.map((e: string) => (
            <TextInput label={e} placeholder={e} {...form.getInputProps(e)} />
          ))}

          <Group position="center" mt="xl">
            <Button type="submit" variant="outline">
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </div>
  );
}

export default CreateIssue;
