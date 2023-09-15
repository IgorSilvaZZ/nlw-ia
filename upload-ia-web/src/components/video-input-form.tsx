import { useState } from "react";
import { FileVideo, Upload } from "lucide-react";

import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent } from "react";

export function VideoInputForm() {
  const [] = useState(null);

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    const [selectedFile] = files;
  }

  return (
    <form className='space-y-6'>
      <label
        className='
                  border 
                  flex 
                  rounded-md 
                  aspect-video 
                  cursor-pointer 
                  border-dashed 
                  text-sm 
                  flex-col 
                  gap-2 
                  items-center 
                  justify-center 
                  text-muted-foreground 
                  hover:bg-primary/5
                '
        htmlFor='video'
      >
        <FileVideo className='w-4 h-4' />
        Selecione um video
      </label>
      <input
        type='file'
        id='video'
        accept='video/mp4'
        className='sr-only'
        onChange={handleFileSelected}
      />

      <Separator />

      <div className='space-y-2'>
        <Label htmlFor='transcription_prompt'>Prompt de Transcrição</Label>
        <Textarea
          id='transcription_prompt'
          placeholder='Inclua palavras-chaves mencionadas no video separadas por virgula (,)'
          className='h-20 leading-relaxed resize-none'
        />
      </div>

      <Button type='submit' className='w-full'>
        Carregar Video
        <Upload className='w-4 h-4 ml-2' />
      </Button>
    </form>
  );
}
