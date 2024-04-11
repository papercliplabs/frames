import { createFFmpeg } from "@ffmpeg/ffmpeg";

export default function avifToGif() {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  // Assuming the AVIF image is sent in the request body as a binary blob
  const avifData = req.body; // You might need to adjust based on how you're sending the data

  // Load the AVIF file into FFmpeg's virtual file system under the name 'input.avif'
  ffmpeg.FS("writeFile", "input.avif", await fetchFile(avifData));

  // Perform the conversion
  await ffmpeg.run("-i", "input.avif", "output.gif");

  // Read the result
  const gifData = ffmpeg.FS("readFile", "output.gif");

  // Send the GIF back as the response
  res.setHeader("Content-Type", "image/gif");
  res.send(gifData);
}
