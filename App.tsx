import React, { useContext, useEffect, useRef, useState } from 'react'
import { Platform, NativeModules, StyleSheet, Text, View,Image } from 'react-native';
import {
  VisionCameraProxy,
  runAtTargetFps,
  useCameraDevice,
  useCameraDevices,
  useFrameProcessor
} from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import { Camera } from 'react-native-vision-camera';
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


  const  [photo, setPhoto]  = useState(null)
  const camera = useRef(null)
  const takePhoto = async () => {
    try {
      //Error Handle better
      if (camera.current == null) throw new Error('Camera Ref is Null');
      console.log('Photo taking ....');
      const photo = await camera.current.takePhoto({});
      console.log(photo.path)
      console.log(photo.orientation)

      console.log('width',photo.width)
      console.log('height',photo.height)

      let rotation = 0
      if ( Platform.OS === 'ios') {
        rotation = 0
      } else {
        rotation = 90
      }
      ImageResizer.createResizedImage(photo.path, 500, 500,'JPEG',
      100,
      rotation,
      undefined,
      false,)
      .then(response => {
        setPhoto(response.path)
      })
      .catch(err => {
     
      });
      
      //setPhoto(photo.path)


    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    
      // setTimeout(() => 
      // {
      //    takePhoto()
      // },
      // 4000);

  
  }, [])


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
console.log(frame.pixelFormat)
       
        // if (progress.value == 5 ) {
        //   myFunctionJS()
        // }
       //  console.log(frame.toArrayBuffer())
        // const faces =  plugin.call(frame)

        // if ( Platform.OS === 'ios') {
        //   console.log("res scan face ",JSON.stringify(faces))
        //   // is ios

        //   if ( progress.value == 0 ) {
        //     if ( faces?.smiling ) {
        //       progress.value = 1
        //       smiling = true
        //       console.log('step=',1)
        //       myFunctionJS()
        //     }
        //   }

        //   if ( progress.value == 1 ) {
        //      // turn right
        //     if ( Number(faces?.faceAngle) > 4.0 ) {
        //       progress.value = 2
        //       smiling = true
        //       console.log('step=',2)
        //       myFunctionJS()
        //     }
        //   }

        //   if ( progress.value == 2 ) {
        //     // turn left
        //     if ( Number(faces?.faceAngle) < -4.0 ) {
        //       progress.value = 3
        //       smiling = true
        //       console.log('step=',3)
        //       myFunctionJS()
        //     }
        //   }

        //   if ( progress.value == 3 ) {
        //     if ( faces?.blinking ) {
        //       progress.value = 4
        //       smiling = true
        //       console.log('step=',4)
        //       myFunctionJS()
        //     }
        //   }


        // } else {
        //   // is andoird
        //   console.log("res scan face ",JSON.stringify(faces))
        //   if ( faces != undefined ) {
        //     if ( step == 0 ) {
        //       if ( Number(faces?.smiling) > 0.8 ) {
               
        //         smiling = true
        //         console.log('step=',1)
        //       }
        //     }

        //     if ( smiling ) {
        //       // turn right
        //       if ( Number(faces?.rollAngle) > 3.0 ) {
        //         rollAngleLeft = true
                
        //         console.log('step=',2)
        //       }
        //     }

        //     if ( smiling &&  rollAngleLeft) {
        //        // turn left
        //         if ( Number(faces?.rollAngle) < -3.0 ) {
        //           rollAngleRight = true
                 
        //           console.log('step=',3)
        //         }
        //     }

        //     if ( smiling  ) {
        //       if ( Number(faces?.eyeOpenProbability) < 0.5 ) {
        //         eyeOpenProbability = true

        //         console.log('step=',4)
        //         console.log('success')
        //       }
        //     }
        //     //console.log('step=',step)
        //   }


        //   console.log('smiling=',smiling)
        //   console.log('rollAngleLeft=',rollAngleLeft)
        //   console.log('rollAngleRight=',rollAngleRight)
        //   console.log('eyeOpenProbability=',eyeOpenProbability)
         
        // //  runOnJS(setStep)(8);
        // }
    })

   
  }, []);

  const handleLorem = (lorem: boolean) => { setStep(8) }


  return  device != null ? (
    <>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          photo={true}
         // pixelFormat="yuv"
        />
         <Text style={styles.innerText}>{textStep}</Text>
         {photo != null && (
                    <Image style={{width: '100%', height: '100%'}} source={{uri: 'file://' + photo}} />
                  )}
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
