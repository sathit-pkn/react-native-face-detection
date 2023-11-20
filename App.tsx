import * as React from 'react';
import { runOnJS } from 'react-native-reanimated';

import { NativeModules, StyleSheet } from 'react-native';
import {
  VisionCameraProxy,
  runAtTargetFps,
  useCameraDevice,
  useCameraDevices,
  useFrameProcessor
} from 'react-native-vision-camera';


import { Camera } from 'react-native-vision-camera';
import { useEffect, useState } from 'react';
const plugin = VisionCameraProxy.initFrameProcessorPlugin('detectFaces')

// const plugin = VisionCameraProxy.initFrameProcessorPlugin('faceDetect')

// export function faceDetect(frame: Frame) {
//   'worklet'
//   if (plugin == null) {
//     throw new Error("Failed to load Frame Processor Plugin!")
//   }
//   return plugin.call(frame)
// }

export default function App() {
  const [cameraPermission, setCameraPermission] = useState()

  const device = useCameraDevice('front')


  useEffect(() => {
    Camera.getCameraPermissionStatus().then((response: any) => {
      setCameraPermission(response)
    })

  }, [])

  useEffect(() => {
    if (cameraPermission != 'authorized') {
      Camera.requestCameraPermission().then((response: any) => {
        setCameraPermission(response)
      })
    }
  }, [cameraPermission])

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
 

    runAtTargetFps(2, () => {
      'worklet'
 
        if (plugin == null) {
          throw new Error("Failed to load Frame Processor Plugin!")
        }
        const faces =  plugin.call(frame)
        console.log("res scan fece ",faces?.example_str)
      
    })
  }, []);

  return device != null ? (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
    />
  ) : null;
}