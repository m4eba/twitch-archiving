import WebSocket from 'ws';
import WebSocketAsPromised from 'websocket-as-promised';
const logger = {
    debug: console.log,
    trace: console.log,
};
const socketMap = new Map();
const sessionIdMap = new Map();
const ws = await socketReady('test', '');
console.log('ready');
//ws.close();
async function socketReady(user, recordingId) {
    let socket = socketMap.get(user + '-' + recordingId);
    if (socket !== undefined && socket.isOpened)
        return socket;
    socket = createWebSocket(recordingId);
    console.log('created');
    socket.onError.addListener((e) => {
        console.log('error', e);
        if (socket !== undefined) {
            socket.close();
        }
    });
    socket.onClose.addListener(() => {
        console.log('close');
        socketMap.delete(user + '-' + recordingId);
    });
    console.log('open');
    await socket.open();
    console.log('wait for session');
    const msg = await socket.waitUnpackedMessage((data) => data !== undefined && data.session_id !== undefined);
    console.log('session', msg);
    socket.onUnpackedMessage.addListener((data) => console.log('unpacked msg', data));
    console.log('session id', msg);
    return socket;
    /*
    if (socket !== undefined && socket.isOpening) {
        socket.onClose.addListener( () => {
          //tries++;
          resolve(socketReady(user, recordingId));
        });
  
        return;
      });
      let initNew = true;
      if (socket !== undefined && socket.readyState === WebSocket.CONNECTING) {
        initNew = false;
      }
  
      if (initNew || socket === undefined || socket === null) {
        socket = openWebSocket('');
        socketMap.set(user + '-' + recordingId, socket);
      }
      socket.onopen = () => {
        console.log('connected waiting on session begin');
      };
  
      socket.onmessage = async (message) => {
        //const res = JSON.parse(message.data);
        //console.log(message.data);
        const msg = JSON.parse(message.data.toString());
        logger.trace({ msg }, 'onmessage');
        if (msg.message_type === 'SessionBegins') {
          if (socket !== undefined) {
            resolve(socket);
          } else {
            reject();
          }
        }
        if (msg.message_type === 'FinalTranscript') {
          console.log('final', msg);
        }
      };
      socket.onerror = (e) => {
        console.log('error', e);
        if (socket !== undefined) {
          socket.close();
        }
      };
  
      socket.onclose = () => {
        socketMap.delete(user + '-' + recordingId);
      };
    });*/
}
function createWebSocket(session_id) {
    let url = 'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000';
    if (session_id !== undefined && session_id.length > 0) {
        url = 'wss://api.assemblyai.com/v2/realtime/ws/' + session_id;
    }
    const ws = new WebSocketAsPromised(url, {
        // @ts-ignore
        createWebSocket: (url) => {
            return new WebSocket(url, undefined, {
                headers: {
                    authorization: 'e178806c70ca48c393da1783bfb077a5',
                },
            });
        },
        extractMessageData: (event) => event,
        packMessage: (data) => JSON.stringify(data),
        unpackMessage: (data) => JSON.parse(data.toString()),
    });
    return ws;
}
