import { CreateTaskListModalProps } from "@shared/data/Tasks/interfaces";
import { useCreateTaskList } from "@shared/hooks/tasks/useTasks";
import InputModal from "../../Common/InputModal";

export default function CreateTaskListModal({ isOpen, onClose }: CreateTaskListModalProps) {
  const { mutate: createTaskList, isPending: isCreating } = useCreateTaskList();

  const handleSubmit = (values: Record<string, string>) => {
    if (!values.name.trim()) return;

    createTaskList(values.name.trim());
    onClose();
  };

  return (
    <InputModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Utwórz nową listę zadań"
      inputs={[
        {
          name: "name",
          label: "Nazwa listy",
          placeholder: "np. Zadania domowe, Praca...",
          required: true,
          autoFocus: true,
        },
      ]}
      submitButtonText="Utwórz"
      cancelButtonText="Anuluj"
      isLoading={isCreating}
    />
  );
}
