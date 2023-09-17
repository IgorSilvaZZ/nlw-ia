import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { api } from "@/lib/axios";

interface Prompt {
  id: string;
  title: string;
  template: string;
}

interface PromptSelectProps {
  onPromptSelected: (template: string) => void;
}

export const PromptSelect = ({ onPromptSelected }: PromptSelectProps) => {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);

  async function getPrompts() {
    const { data } = await api.get("/prompts");

    setPrompts(data);
  }

  function handlePromptSelected(promptId: string) {
    const seletectPrompt = prompts?.find(prompt => prompt.id === promptId);

    if (!seletectPrompt) {
        return;
    }

    onPromptSelected(seletectPrompt.template);

  }

  useEffect(() => {
    getPrompts();
  }, []);

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder='Selecione um prompt...' />
      </SelectTrigger>

      <SelectContent>
        {prompts?.map((prompt) => (
          <SelectItem key={prompt.id} value={prompt.id}>
            {prompt.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
