//
//  detectFace.swift
//  examfacedetect
//
//  Created by sathit on 17/11/2566 BE.
//

import Foundation
import VisionCamera
import Vision

@objc(FaceDetectorFrameProcessorPlugin)
public class FaceDetectorFrameProcessorPlugin: FrameProcessorPlugin {
  public override init(options: [AnyHashable : Any]! = [:]) {
    super.init(options: options)
  }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable : Any]?)  -> Any {
    let buffer = frame.buffer
    let orientation = frame.orientation
    
    

    guard let frame = CMSampleBufferGetImageBuffer(buffer) else {
        debugPrint("unable to get image from sample buffer")
        return []
    }
//    self.detectFace(in: frame, completion: { (success) -> Void in
//      
//    })
    
    let ciImage = CIImage(cvPixelBuffer: frame)
    let res = self.detectEmoji(imageCi: ciImage)
    
    return [
         "res": res
       ]
  }
  
  
  private func detectEmoji(imageCi : CIImage) -> String {
        let faceImage = imageCi
        let accuracy = [CIDetectorAccuracy: CIDetectorAccuracyHigh]
        let faceDetector = CIDetector(ofType: CIDetectorTypeFace, context: nil, options: accuracy)
        let faces = faceDetector?.features(in: faceImage, options: [CIDetectorSmile:true, CIDetectorEyeBlink: true])

         if !faces!.isEmpty {
             for face in faces as! [CIFaceFeature] {
                 let leftEyeClosed = face.leftEyeClosed
                 let rightEyeClosed = face.rightEyeClosed
                 let blinking = face.rightEyeClosed && face.leftEyeClosed
                 let isSmiling = face.hasSmile

               
//                 print("isSmiling: \(isSmiling)")
//                 print("blinking: \(blinking)")
//                 print("rightEyeClosed: \(rightEyeClosed)")
//                 print("leftEyeClosed: \(leftEyeClosed)\n\n")
//                 print("faceAngle: \(face.faceAngle)\n\n")
               
                 return "isSmiling: \(isSmiling),blinking: \(blinking), faceAngle: \(face.faceAngle) "
             }
         } else {
           return ""
         }
    return ""
  }
  
 
  

  
}
