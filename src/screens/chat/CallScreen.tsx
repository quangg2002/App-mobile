import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, Button, View, Image, TouchableOpacity, Alert } from "react-native";

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";
import CAT from '../../assets/ccat.jpg'
import CallActionBox from "./CallActionBox";
import Container from "@/components/Container";
import { deepPurple } from "@/styles/styles";
import { MaterialIcons } from '@expo/vector-icons';
import Draggable from '@ngenux/react-native-draggable-view';
import RootNavigation from "@/route/RootNavigation";
import { useSelector } from "react-redux";
import { RootReducer } from "@/redux/store/reducer";
import uuid from 'react-native-uuid'

import firestore from '@react-native-firebase/firestore';
import { BASE_API } from "@/services/BaseApi";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 2,
};

const CallScreen = ({ route }) => {
  const { phoneNumber, fullname } = useSelector((state: RootReducer) => state.authReducer);
  const { calleePhone } = route.params;
  const draggableRef = useRef();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [cachedLocalPC, setCachedLocalPC] = useState<RTCPeerConnection>();
  const [isMuted, setIsMuted] = useState(false);
  const [isOffCam, setIsOffCam] = useState(false);
  const [isFront, setIsFront] = useState(true);
  const roomId = String(uuid.v4());

  useEffect(() => {
    startLocalStream();
  }, []);

  useEffect(() => {
    if (localStream) {
      startCall(roomId);
    }
  }, [localStream]);

  async function endCall() {
    RootNavigation.pop();

    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.removeEventListener("mute");
        track.removeEventListener("unmute");
        track.removeEventListener("ended");
        track.release();
        track.stop();
      });
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach(track => {
        track.removeEventListener("mute");
        track.removeEventListener("unmute");
        track.removeEventListener("ended");
        track.release();
        track.stop();
      });
    }

    if (cachedLocalPC) {
      cachedLocalPC.getTransceivers().forEach((transceiver) => {
        transceiver.stop();
      });
      const senders = cachedLocalPC.getSenders();
      senders.forEach((sender) => {
        cachedLocalPC.removeTrack(sender);
      });
      cachedLocalPC.close();
    }

    const roomRef = firestore().collection('room').doc(roomId);
    await roomRef.update({ answer: firestore.FieldValue.delete(), connected: false });

    setLocalStream(null);
    setRemoteStream(null);
    setCachedLocalPC(null);
  }

  const startLocalStream = async () => {
    const facingMode = isFront ? "user" : "environment";
    const devices: MediaDeviceInfo[] = await mediaDevices.enumerateDevices();
    const videoSourceId = devices.find(
      (device) => device.kind === "videoinput"
    );
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500,
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
  };

  const sendVideoCallRequest = () => {
    BASE_API.post(
      `/notification`,
      {
        type: 'VIDEO_CALL',
        phoneNumber: calleePhone,
        title: fullname,
        content: roomId
      }
    ).then(response => { console.log('sendvideocall', response.data) })
      .catch(error => { console.log(error.response) });
  };

  const startCall = async (id) => {
    const localPC = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach((track) => {
      localPC.addTrack(track, localStream);
    });

    const roomRef = firestore().collection('room').doc(id);
    const callerCandidatesCollection = roomRef.collection('callerCandidates');
    const calleeCandidatesCollection = roomRef.collection('calleeCandidates');

    localPC.addEventListener("icecandidate", async (e) => {
      if (!e.candidate) {
        // console.log("Got final candidate!");
        return;
      }
      await callerCandidatesCollection.add(e.candidate.toJSON());
    });

    localPC.ontrack = (e) => {
      const newStream = new MediaStream();
      e.streams[0].getTracks().forEach((track) => {
        newStream.addTrack(track);
      });
      setRemoteStream(newStream);
    };

    const offer = await localPC.createOffer();
    await localPC.setLocalDescription(offer);

    await roomRef.set({ offer, connected: false }, { merge: true });

    // Listen for remote answer
    roomRef.onSnapshot((doc) => {
      const data = doc.data();
      if (!localPC.remoteDescription && data.answer) {
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        localPC.setRemoteDescription(rtcSessionDescription);
      } else {
        setRemoteStream(null);
      }
    });

    // When answered, add candidate to peer connection
    calleeCandidatesCollection.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let data = change.doc.data();
          localPC.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    setCachedLocalPC(localPC);
    sendVideoCallRequest();
  };

  const switchCamera = () => {
    localStream.getVideoTracks().forEach((track) => track._switchCamera());
  };

  const toggleMute = () => {
    if (!remoteStream) {
      return;
    }
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const toggleCamera = () => {
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsOffCam(!isOffCam);
    });
  };

  return (
    <Container backgroundColor='#202124'>
      {localStream &&
        <Draggable
          edgeSpacing={2}
          shouldStartDrag={true}
          initialOffsetX={0}
          initialOffsetY={0}
          orientation="landscape"
          ref={ref => (draggableRef.current = ref)}
          viewStyle={{
            width: 100,
            height: 150,
          }}
        >
          <RTCView
            objectFit="cover"
            zOrder={1}
            style={{
              flex: 1
            }}
            streamURL={localStream && localStream.toURL()}
          />
          <TouchableOpacity
            onPress={switchCamera}
            style={{
              position: 'absolute',
              width: 30,
              height: 30,
              backgroundColor: deepPurple,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
              alignSelf: 'center',
              bottom: -15
            }}
          >
            <MaterialIcons name="flip-camera-android" size={18} color='white' />
          </TouchableOpacity>
        </Draggable>
      }

      {remoteStream &&
        <RTCView
          zOrder={0}
          style={{
            flex: 1
          }}
          streamURL={remoteStream && remoteStream.toURL()}
        />
      }

      <CallActionBox
        isMuted={isMuted}
        toggleMute={toggleMute}
        toggleCamera={toggleCamera}
        endCall={endCall}
        switchCamera={switchCamera}
      />
    </Container>
  );
};

export default CallScreen;

const styles = StyleSheet.create({

});
