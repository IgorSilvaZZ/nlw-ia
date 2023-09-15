import { FFmpeg } from "@ffmpeg/ffmpeg";

import coreURL from "../ffmpegffmpeg-core.js?url";
import wasmURL from "../ffmpegffmpeg-core.wasm?url";
import workerURL from "../ffmpegffmpeg-worker.js?url";

let ffmpeg: FFmpeg | null;

export async function getFFmpeg() {
  if (ffmpeg) {
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();

  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL,
      wasmURL,
      workerURL,
    });
  }

  return ffmpeg;
}
