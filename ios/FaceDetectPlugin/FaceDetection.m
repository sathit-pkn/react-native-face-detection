//
//  FaceDetection.m
//  examfacedetect
//
//  Created by sathit on 17/11/2566 BE.
//




#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#import "examfacedetect-Swift.h" // <--- replace "YOUR_XCODE_PROJECT_NAME" with the actual value of your xcode project name

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(FaceDetectorFrameProcessorPlugin, detectFaces)
