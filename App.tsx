import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Platform, NativeModules, StyleSheet, Text, View,Image } from 'react-native';
import {
  VisionCameraProxy,
  runAtTargetFps,
  useCameraDevice,
  useCameraDevices,
  useFrameProcessor
} from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import { useSharedValue } from 'react-native-worklets-core';



import { Camera, CameraType, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from "expo-face-detector"




const detections = {
  BLINK: { instruction: "Blink both eyes", minProbability: 0.3 },
  TURN_HEAD_LEFT: { instruction: "Turn head left", maxAngle: -15 },
  TURN_HEAD_RIGHT: { instruction: "Turn head right", minAngle: 15 },
  NOD: { instruction: "Nod", minDiff: 1.5 },
  SMILE: { instruction: "Smile", minProbability: 0.7 }
}






const plugin = VisionCameraProxy.initFrameProcessorPlugin('detectFaces')



let smiling  = false;
let rollAngleLeft  = false;
let rollAngleRight = false
let eyeOpenProbability  = false;

export default function App() {


  const [textStep, setTextStep] = useState('ยิ้ม---')
  const onFacesDetected = (result: FaceDetectionResult) => {

 

  // 1. There is only a single face in the detection results.
  if (result.faces.length !== 1) {
    return
  }
 
  const face = result.faces[0]
 
  const faceRect: Rect = {
    minX: face.bounds.origin.x,
    minY: face.bounds.origin.y,
    width: face.bounds.size.width,
    height: face.bounds.size.height
  }
 
  // 2. The face is fully contained within the camera preview.
  const edgeOffset = 50
  const faceRectSmaller: Rect = {
    width: faceRect.width - edgeOffset,
    height: faceRect.height - edgeOffset,
    minY: faceRect.minY + edgeOffset / 2,
    minX: faceRect.minX + edgeOffset / 2
  }
 
  
 
 // console.log('face smile =',face.smilingProbability >= detections.SMILE.minProbability)
 console.log(face.yawAngle);

//  console.log('face blink =',face.leftEyeOpenProbability <= detections.BLINK.minProbability)
    if ( face.yawAngle >= 300 ) {
      //สำหรับ andoird เครื่องแปลกๆ
     // console.log('face TURN_HEAD_LEFT  =', true)
      setTextStep('face TURN_HEAD_RIGHT  =  true')
    } else {
      console.log('face TURN_HEAD_LEFT ios  =', face.yawAngle <= -10)
    }
  
  //console.log('face TURN_HEAD_LEFT  =', face.yawAngle >= 300)
  console.log('face TURN_HEAD_RIGHT  =',face.yawAngle >= 25)
  // TODO: Process results at this point.


}




  const [cameraPermission, setCameraPermission] = useState()

  const device = useCameraDevice('front')


  const progress = useSharedValue(0)

  const [step, setStep] = useState(0)




  const  [photo, setPhoto]  = useState(null)

  const [permission, requestPermission] = Camera.useCameraPermissions();
  

  useEffect(() => {
    
      // setTimeout(() => 
      // {
      //    takePhoto()
      // },
      // 4000);

  
  }, [])


  // const myFunction = (() => {
  //     //console.log("my function ")
  //     if (progress.value == 1 ) {
  //       setTextStep('หันขวา')
  //     }

  //     if (progress.value == 2 ) {
  //       setTextStep('หันช้าย')
  //     }

  //     if (progress.value == 3 ) {
  //       setTextStep('กระพริบตา')
  //     }

  //     if (progress.value == 4 ) {
  //       setTextStep('สำเร็จ')
  //     }
     
  // })



  const [type, setType] = useState(CameraType.front);
  return  device != null ? (
    <>
        <Camera
          style={StyleSheet.absoluteFill}
          type={type}
          onFacesDetected={onFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.accurate,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 1000,
            tracking: false,
          }}
        ></Camera>
         <Text style={styles.innerText}>{textStep}</Text>
         {photo != null && (
                    <Image style={{width: '100%', height: '100%'}} source={{uri: 'file://' + photo}} />
                  )}
    </>
  ) : null;
     
  
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 500,
    width: 500,
  },
  baseText: {
    fontWeight: 'bold',
  },
  innerText: {
    marginTop: 100,
    marginLeft: 100,
    fontSize: 24,
    color: 'red',
  },
});

interface FaceDetection {
  rollAngle: number
  yawAngle: number
  smilingProbability: number
  leftEyeOpenProbability: number
  rightEyeOpenProbability: number
  bounds: {
    origin: {
      x: number
      y: number
    }
    size: {
      width: number
      height: number
    }
  }
}