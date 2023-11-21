import * as React from 'react';
import { Platform, NativeModules, StyleSheet, Text, View } from 'react-native';
import {
  VisionCameraProxy,
  runAtTargetFps,
  useCameraDevice,
  useCameraDevices,
  useFrameProcessor
} from 'react-native-vision-camera';


import { Camera } from 'react-native-vision-camera';
import { useEffect, useState } from 'react';
import { useSharedValue } from 'react-native-worklets-core';



const plugin = VisionCameraProxy.initFrameProcessorPlugin('detectFaces')


let smiling  = false;
let rollAngleLeft  = false;
let rollAngleRight = false
let eyeOpenProbability  = false;

export default function App() {


  const [cameraPermission, setCameraPermission] = useState()

  const device = useCameraDevice('front')


  const progress = useSharedValue(0)

  const [step, setStep] = useState(0)

  const [textStep, setTextStep] = useState('ยิ้ม')

  const myFunction = (() => {
      //console.log("my function ")
      if (progress.value == 1 ) {
        setTextStep('หันขวา')
      }

      if (progress.value == 2 ) {
        setTextStep('หันช้าย')
      }

      if (progress.value == 3 ) {
        setTextStep('กระพริบตา')
      }

      if (progress.value == 4 ) {
        setTextStep('สำเร็จ')
      }
     
  })

  const myFunctionJS = Worklets.createRunInJsFn(myFunction)

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

       
        // if (progress.value == 5 ) {
        //   myFunctionJS()
        // }
        const faces =  plugin.call(frame)

        if ( Platform.OS === 'ios') {
          console.log("res scan face ",JSON.stringify(faces))
          // is ios

          if ( progress.value == 0 ) {
            if ( faces?.smiling ) {
              progress.value = 1
              smiling = true
              console.log('step=',1)
              myFunctionJS()
            }
          }

          if ( progress.value == 1 ) {
             // turn right
            if ( Number(faces?.faceAngle) > 4.0 ) {
              progress.value = 2
              smiling = true
              console.log('step=',2)
              myFunctionJS()
            }
          }

          if ( progress.value == 2 ) {
            // turn left
            if ( Number(faces?.faceAngle) < -4.0 ) {
              progress.value = 3
              smiling = true
              console.log('step=',3)
              myFunctionJS()
            }
          }

          if ( progress.value == 3 ) {
            if ( faces?.blinking ) {
              progress.value = 4
              smiling = true
              console.log('step=',4)
              myFunctionJS()
            }
          }


        } else {
          // is andoird
          console.log("res scan face ",JSON.stringify(faces))
          if ( faces != undefined ) {
            if ( step == 0 ) {
              if ( Number(faces?.smiling) > 0.8 ) {
               
                smiling = true
                console.log('step=',1)
              }
            }

            if ( smiling ) {
              // turn right
              if ( Number(faces?.rollAngle) > 3.0 ) {
                rollAngleLeft = true
                
                console.log('step=',2)
              }
            }

            if ( smiling &&  rollAngleLeft) {
               // turn left
                if ( Number(faces?.rollAngle) < -3.0 ) {
                  rollAngleRight = true
                 
                  console.log('step=',3)
                }
            }

            if ( smiling  ) {
              if ( Number(faces?.eyeOpenProbability) < 0.5 ) {
                eyeOpenProbability = true

                console.log('step=',4)
                console.log('success')
              }
            }
            //console.log('step=',step)
          }


          console.log('smiling=',smiling)
          console.log('rollAngleLeft=',rollAngleLeft)
          console.log('rollAngleRight=',rollAngleRight)
          console.log('eyeOpenProbability=',eyeOpenProbability)
         
        //  runOnJS(setStep)(8);
        }
    })

   
  }, []);

  const handleLorem = (lorem: boolean) => { setStep(8) }


  return  device != null ? (
    <>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          pixelFormat="yuv"
        />
         <Text style={styles.innerText}>{textStep}</Text>
    </>
  ) : null;
     
  
}

const styles = StyleSheet.create({
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
