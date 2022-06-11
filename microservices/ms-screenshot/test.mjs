import Ffmpeg from 'fluent-ffmpeg';

async function execFfmpeg(command) {
  const p = new Promise((resolve, reject) => {
    command.on('start', (c) => {
      console.log('ffmpeg started:', c);
    });
    command.on('error', (err) => {
      reject(err);
    });
    command.on('end', () => {
      console.log('done', arguments);
      resolve();
    });
    command.run();
  });
  return p;
}

const input =
  '../../example/segments/peter_berling/stream/46548364765/00009.ts';
const output = '../../example/screenshots/26/00009.png';

const command = Ffmpeg()
  .input(input)
  .seek(1.0)
  .outputOptions('-vframes', '1', '-q:v', '2')
  .output(output);

await execFfmpeg(command);
