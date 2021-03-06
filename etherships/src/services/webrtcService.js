import Peer from "peerjs";

import { WEBRTC_SERVER, WEBRTC_API_KEY, WEBRTC_PORT } from '../constants/config';

import short from 'short-uuid';

let peer;
let conn;

export const createPeer = (peerId) => {
  try {
    peer = new Peer(peerId, {
      key: WEBRTC_API_KEY,
      debug: 3,
      host: WEBRTC_SERVER,
      port: WEBRTC_PORT,
    });

    peer.on('error', (err) => {
      console.log('error', err);

      if(err.message.indexOf('is taken') !== -1) {
        localStorage.setItem('peer', short.uuid());
        window.location.reload();
      } else {
        // localStorage.setItem('peer', short.uuid());
      }
    });

    peer.on('connection', (_conn) => { conn = _conn });

    return peer;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const connectToPlayer = (peerId) => {
    try {
        conn = peer.connect(peerId);

        return conn;
    } catch(err) {
        console.log(err);
        return null;
    }
};

export const setWebRTCConnection = (_conn) => conn = _conn;

export const send = (data) => {
  if (!conn) {
    console.error('Message not sent - connection missing!', data);
    return false;
  }

  conn.send(data);
};