import { ArgumentConfig, parse } from 'ts-command-line-args';
import { default as apiLiveTest } from './api-live-test/index.js';
import { default as assemplyai } from './assemblyai/index.js';
import { default as chatClient } from './chat-client/index.js';
import { default as chatDump } from './chat-dump/index.js';
import { default as chatEmoteUpdate } from './chat-emote-updater/index.js';
import { default as chatSave } from './chat-save/index.js';
import { default as clipsDownload } from './clips-download/index.js';
import { default as clipsList } from './clips-list/index.js';
import { default as clipsLiveScheduler } from './clips-live-scheduler/index.js';
import { default as playlistLive } from './playlist-live/index.js';
import { default as playlistStoryboard } from './playlist-storyboard/index.js';
import { default as playlistUpdate } from './playlist-update/index.js';
import { default as playlistUpdateTimer } from './playlist-update-timer/index.js';
import { default as pubsubClient } from './pubsub-client/index.js';
import { default as pubsubFilter } from './pubsub-filter/index.js';
import { default as retryLog } from './retry-log/index.js';
import { default as screenshot } from './screenshot/index.js';
import { default as screenshotMinimize } from './screenshot-minimize/index.js';
import { default as screenshotStoryboard } from './screenshot-storyboard/index.js';
import { default as segmentDownload } from './segment-download/index.js';
import { default as taskDone } from './task-done/index.js';
import { default as vosk } from './vosk/index.js';
import { default as websocketDump } from './websocket-dump/index.js';

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
  case 'api-live-test':
    apiLiveTest(args);
    break;
  case 'assemblyai':
    assemplyai(args);
    break;
  case 'chat-client':
    chatClient(args);
    break;
  case 'chat-dump':
    chatDump(args);
    break;
  case 'chat-emote-update':
    chatEmoteUpdate(args);
    break;
  case 'chat-save':
    chatSave(args);
    break;
  case 'clips-download':
    clipsDownload(args);
    break;
  case 'clips-list':
    clipsList(args);
    break;
  case 'clips-live-scheduler':
    clipsLiveScheduler(args);
    break;
  case 'playlist-live':
    playlistLive(args);
    break;
  case 'playlist-storyboard':
    playlistStoryboard(args);
    break;
  case 'playlist-update':
    playlistUpdate(args);
    break;
  case 'playlist-update-timer':
    playlistUpdateTimer(args);
    break;
  case 'pubsub-client':
    pubsubClient(args);
    break;
  case 'pubsub-filter':
    pubsubFilter(args);
    break;
  case 'retry-log':
    retryLog(args);
    break;
  case 'screenshot':
    screenshot(args);
    break;
  case 'screenshot-minimize':
    screenshotMinimize(args);
    break;
  case 'screenshot-storyboard':
    screenshotStoryboard(args);
    break;
  case 'segment-download':
    segmentDownload(args);
    break;
  case 'task-done':
    taskDone(args);
    break;
  case 'vosk':
    vosk(args);
    break;
  case 'websocket-dump':
    websocketDump(args);
    break;
}
