import fs from 'fs';
import path from 'path';
import { execFfmpeg } from '@twitch-archiving/utils';
import Ffmpeg from 'fluent-ffmpeg';
import WebSocket from 'ws';
import MemoryStream from 'memorystream';

const sleep = (time: number) =>
  new Promise((res) => setTimeout(res, time, 'done sleeping'));

const folder =
  '/home/petschm/dev/twitch/twitch-archiving/example/segments/jinnytty/stream/46461510413';
const wavfolder =
  '/home/petschm/dev/twitch/twitch-archiving/example/segments/jinnytty/stream/audio';
const files = await fs.promises.readdir(folder);

let socket: WebSocket | undefined = undefined;
let tries = 0;
let session_id: string | undefined = undefined;

for (let i = 0; i < files.length; ++i) {
  const input = files[i];
  const command = Ffmpeg()
    .input(path.join(folder, input))
    .outputOptions(
      '-vn',
      '-acodec',
      'pcm_s16le',
      '-ar',
      '16000',
      '-ac',
      '1',
      '-f',
      'segment',
      '-segment_time',
      '1.2'
    )
    .output(path.join(wavfolder, 'out%03d.wav'));

  await execFfmpeg(command);

  const waves = await fs.promises.readdir(wavfolder);
  for (let ii = 0; ii < waves.length; ++ii) {
    const name = path.join(wavfolder, waves[ii]);
    const content = await fs.promises.readFile(name);
    const data = Buffer.from(content).toString('base64');

    console.log('send', data.length);

    const ws = await socketReady();

    ws.send(
      JSON.stringify({
        audio_data: data,
      })
    );
    await sleep(1000);
    await fs.promises.rm(name);
  }
}

const ws = await socketReady();
ws.send(
  JSON.stringify({
    terminate_session: true,
  })
);

async function socketReady(): Promise<WebSocket> {
  if (socket !== undefined && socket.readyState === WebSocket.OPEN)
    return socket;
  return new Promise((resolve, reject) => {
    /*if (tries === 5) {
      reject('max tries reached');
      return;
    }*/

    if (socket !== undefined && socket.readyState !== WebSocket.CONNECTING) {
      socket.onclose = () => {
        tries++;
        resolve(socketReady());
      };

      return;
    }
    let initNew = true;
    if (socket !== undefined && socket.readyState === WebSocket.CONNECTING) {
      initNew = false;
    }

    if (initNew || socket === undefined) {
      socket = openWebSocket('', '');
    }
    socket.onopen = () => {
      console.log('connected');
      if (socket !== undefined) {
        resolve(socket);
      } else {
        reject();
      }
    };
  });
}

function openWebSocket(user: string, recordingId: string): WebSocket {
  console.log('connect');
  let url = 'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000';
  if (session_id !== undefined) {
    url = 'wss://api.assemblyai.com/v2/realtime/ws/' + session_id;
  }
  const ws = new WebSocket(url, undefined, {
    headers: {
      authorization: '903a00e5d52146568131c62985d8c6ba',
    },
  });

  ws.onmessage = async (message) => {
    //const res = JSON.parse(message.data);
    console.log(message.data);
    const msg = JSON.parse(message.data.toString());
    if (msg.message_type === 'SessionBegins') {
      session_id = msg.session_id;
    }
    if (msg.message_type === 'FinalTranscript') {
      await fs.promises.appendFile('log.txt', message.data.toString() + '\n');
    }
  };
  ws.onerror = (e) => {
    console.log('error', e);
    tries++;
    ws.close();
  };

  ws.onclose = () => {
    console.log('closed');
    socket = undefined;
  };

  return ws;
}
