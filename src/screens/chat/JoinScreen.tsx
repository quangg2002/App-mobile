import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, Button, View, TouchableOpacity, Image } from "react-native";

import {
    RTCPeerConnection,
    RTCView,
    mediaDevices,
    RTCIceCandidate,
    RTCSessionDescription,
    MediaStream,
} from "react-native-webrtc";
import CallActionBox from "./CallActionBox";
import Draggable from '@ngenux/react-native-draggable-view';
import { deepPurple } from "@/styles/styles";
import { MaterialIcons } from '@expo/vector-icons';
import Container from "@/components/Container";
import CAT from '../../assets/ccat.jpg'
import RootNavigation from "@/route/RootNavigation";

import firestore from '@react-native-firebase/firestore';

const configuration = {
    iceServers: [
        {
            urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
        },
    ],
    iceCandidatePoolSize: 2,
};

const JoinScreen = (props) => {
    const { roomId, refuseCall } = props;
    const draggableRef = useRef();
    const [localStream, setLocalStream] = useState<MediaStream>();
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const [cachedLocalPC, setCachedLocalPC] = useState<RTCPeerConnection>();
    const [isMuted, setIsMuted] = useState(false);
    const [isOffCam, setIsOffCam] = useState(false);
    const [isFront, setIsFront] = useState(true);

    useEffect(() => {
        startLocalStream();
    }, []);

    useEffect(() => {
        localStream && joinCall(roomId);
    }, [localStream]);

    async function endCall() {
        refuseCall();

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
        const facing = isFront ? "front" : "environment";
        const devices: MediaDeviceInfo[] = await mediaDevices.enumerateDevices();
        const videoSourceId = devices.find(
            (device) => device.kind === "videoinput"
        );
        const facingMode = isFront ? "user" : "environment";
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
        const newStream: MediaStream = await mediaDevices.getUserMedia(constraints);
        setLocalStream(newStream);
    };

    const joinCall = async (id) => {
        const roomRef = firestore().collection('room').doc(id);
        const roomSnapshot = await roomRef.get();

        if (!roomSnapshot.exists) return;

        const localPC = new RTCPeerConnection(configuration);
        localStream.getTracks().forEach((track) => {
            localPC.addTrack(track, localStream);
        });

        const callerCandidatesCollection = roomRef.collection('callerCandidates');
        const calleeCandidatesCollection = roomRef.collection('calleeCandidates');

        localPC.addEventListener("icecandidate", (e) => {
            if (!e.candidate) {
                // console.log("Got final candidate!");
                return;
            }
            calleeCandidatesCollection.add(e.candidate.toJSON());
        });

        localPC.ontrack = (e) => {
            const newStream = new MediaStream();
            e.streams[0].getTracks().forEach((track) => {
                newStream.addTrack(track);
            });
            setRemoteStream(newStream);
        };

        const offer = roomSnapshot.data().offer;
        await localPC.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await localPC.createAnswer();
        await localPC.setLocalDescription(answer);

        await roomRef.update({ answer, connected: true });

        const unsubscribe = callerCandidatesCollection.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    let data = change.doc.data();
                    localPC.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });

        const unsubscribeRoom = roomRef.onSnapshot((doc) => {
            const data = doc.data();
            if (!data.answer) {
                console.log('join endcall')
                endCall();
            }
        });

        setCachedLocalPC(localPC);

        return { unsubscribe, unsubscribeRoom };
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
}

export default JoinScreen;

const styles = StyleSheet.create({

});