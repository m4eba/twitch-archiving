import { ArgumentConfig, parse } from 'ts-command-line-args';
import { default as checkFiles } from './check-files/index.js';
import { default as copyPlaylistLog } from './copy-playlist-log/index.js';
import { default as feedRecording } from './feed-recording/index.js';
import { default as initStoryboard } from './init-storyboard/index.js';
import { default as missingDbFiles } from './missing-db-files/index.js';
import { default as readChatDump } from './read-chat-dump/index.js';
import { default as restartStoryboardTask } from './restart-storyboard-task/index.js';
import { default as resumeScreenshot } from './resume-screenshot/index.js';
import { default as startScreenshot } from './start-screenshot/index.js';

interface CommandConfig {
  command: string;
}

const commandConfigOpt: ArgumentConfig<CommandConfig> = {
  command: { type: String, defaultOption: true },
};

const command: CommandConfig = parse<CommandConfig>(commandConfigOpt, {
  argv: process.argv.slice(2),
  stopAtFirstUnknown: true,
});

// @ts-ignore
const args: string[] = command._unknown ? command._unknown : [];

console.log('command', command);
console.log('args', args);
switch (command.command) {
  case 'check-files':
    checkFiles(args);
    break;
  case 'copy-playlist-log':
    copyPlaylistLog(args);
    break;
  case 'feed-recording':
    feedRecording(args);
    break;
  case 'init-storyboard':
    initStoryboard(args);
    break;
  case 'missing-db-files':
    missingDbFiles(args);
    break;
  case 'read-chat-dump':
    readChatDump(args);
    break;
  case 'restart-storyboard-task':
    restartStoryboardTask(args);
    break;
  case 'resume-screenshot':
    resumeScreenshot(args);
    break;
  case 'start-screenshot':
    startScreenshot(args);
    break;
}
