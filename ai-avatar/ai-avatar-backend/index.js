import { VertexAI } from '@google-cloud/vertexai';
import { exec } from 'child_process';
import cors from 'cors';
import dotenv from 'dotenv';
import voice from 'elevenlabs-node';
import express from 'express';
import ffmpegPath from 'ffmpeg-static';
import { promises as fs } from 'fs';

dotenv.config();
// 2️⃣ Immediately log the key so you can verify it
console.log("ELEVEN_LABS_API_KEY is:", process.env.ELEVEN_LABS_API_KEY);
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

// Helper to execute shell commands
const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command failed: ${command}`);
        console.error(stderr);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
};

// Convert MP3 to WAV and generate lip-sync JSON
const lipSyncMessage = async (messageIndex) => {
  const start = Date.now();
  console.log(`Starting conversion for message ${messageIndex}`);

  // Use ffmpeg-static binary for guaranteed availability
  const mp3Path = `audios/message_${messageIndex}.mp3`;
  const wavPath = `audios/message_${messageIndex}.wav`;
  const jsonPath = `audios/message_${messageIndex}.json`;

  // MP3 -> WAV conversion
  await execCommand(
    `"${ffmpegPath}" -y -i "${mp3Path}" "${wavPath}"`
  );
  console.log(`MP3→WAV done in ${Date.now() - start}ms`);

  // Generate lip-sync JSON with Rhubarb
const rhubarbPath = 'C:\\rhubarb-lip-sync\\rhubarb.exe';
  await execCommand(
    `"${rhubarbPath}" -f json -o "${jsonPath}" "${wavPath}" -r phonetic`
  );
  console.log(`Lip-sync done in ${Date.now() - start}ms`);
};

// Read and parse JSON lipsync transcript
const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, 'utf8');
  return JSON.parse(data);
};

// Read audio file and return Base64
const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString('base64');
};

// Route: health check
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route: list available voices from ElevenLabs
app.get('/voices', async (req, res) => {
  const apiKey = process.env.ELEVEN_LABS_API_KEY;
  if (!apiKey) {
    return res.status(400).send({ error: 'ElevenLabs API key not set.' });
  }
  try {
    const voices = await voice.getVoices(apiKey);
    res.send(voices);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to fetch voices.' });
  }
});

// Route: chat and generate TTS + lip-sync + emotions
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // Missing API keys handling
  if (!userMessage) {
    return res.send({ messages: [] });
  }
  if (!elevenLabsApiKey || !openaiKey) {
    return res.send({
      messages: [
        {
          text: "Please set your API keys for OpenAI and ElevenLabs.",
          facialExpression: 'angry',
          animation: 'Angry',
        },
      ],
    });
  }

  // Vertex AI setup
  const vertexAI = new VertexAI({
    project: 'astra-464811',         // <-- your project ID here
    location: 'us-central1',  
  });

  const model = 'gemini-2.5-flash';
  const preview = vertexAI.preview.getGenerativeModel({
    model,
    systemInstruction: {
      role: 'system',
      parts: [
        {
          text:
            'You are a virtual therapy bot designed to provide emotional support and advice to women. Respond with a JSON array of messages (max 3). Each message should include text, facialExpression, and animation properties.',
        },
      ],
    },
  });

  // Send user message to Gemini
  const request = { contents: [ { role: 'user', parts: [{ text: userMessage }] } ] };
  const result = await preview.generateContent(request);
  console.log('Full response: ', JSON.stringify(result));

  // Parse JSON from response markdown
  const raw = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const clean = raw.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  let messages = [];
  try {
    messages = JSON.parse(clean);
  } catch (err) {
    console.error('JSON parse error:', err);
    return res.status(500).send({ error: 'Invalid response format.' });
  }

  // For each message: generate TTS, lip-sync, attach files
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const mp3File = `audios/message_${i}.mp3`;
    await voice.textToSpeech(elevenLabsApiKey, 'cgSgspJ2msm6clMCkdW9', mp3File, msg.text);
    await lipSyncMessage(i);
    msg.audio = await audioFileToBase64(mp3File);
    msg.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
  }

  res.send({ messages });
});

app.listen(port, () => {
  console.log(`Virtual Girlfriend listening on port ${port}`);
});
