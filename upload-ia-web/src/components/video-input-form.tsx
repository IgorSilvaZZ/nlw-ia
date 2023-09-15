import { FormEvent, useMemo, useRef, useState, ChangeEvent } from "react";
import { FileVideo, Upload } from "lucide-react";
import { fetchFile } from "@ffmpeg/util";

import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

import { getFFmpeg } from "@/lib/ffmpeg";
import { api } from "@/lib/axios";

export function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    const [selectedFile] = files;

    setVideoFile(selectedFile);
  }

  async function convertVideoToAudio(video: File) {
    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile("input-mp4", await fetchFile(video));

    ffmpeg.on("log", (log) => {
      console.log(log);
    });

    ffmpeg.on("progress", (progress) => {
      console.log("Converted progress ", Math.round(progress.progress * 100));
    });

    await ffmpeg.exec([
      "-i",
      "input-mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    return audioFile;
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) {
      return;
    }

    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();
    data.append("file", audioFile);

    const response = await api.post("/videos", data);

    const videoId = response.data.video.id;

    await api.post(`/videos/${videoId}/transcription`, prompt);
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form className='space-y-6' onSubmit={handleUploadVideo}>
      <label
        className='
                  border 
                  flex
                  relative
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
        {previewURL ? (
          <>
            <video
              src={previewURL}
              controls={false}
              className='pointer-events-none absolute inset-0'
            />
          </>
        ) : (
          <>
            <FileVideo className='w-4 h-4' />
            Selecione um video
          </>
        )}
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
          ref={promptInputRef}
        />
      </div>

      <Button type='submit' className='w-full'>
        Carregar Video
        <Upload className='w-4 h-4 ml-2' />
      </Button>
    </form>
  );
}