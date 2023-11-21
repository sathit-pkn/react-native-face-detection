package com.examfacedetect.facedetectorframeprocessor;


import android.annotation.SuppressLint;
import android.media.Image;
import android.util.Log;

import com.mrousavy.camera.frameprocessor.Frame;

import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.face.Face;
import com.google.mlkit.vision.face.FaceDetection;
import com.google.mlkit.vision.face.FaceDetector;


import com.google.mlkit.vision.face.FaceDetectorOptions;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.ArrayList;
import java.util.List;

import java.util.Map;

import java.util.HashMap;


public class FaceDetectorFrameProcessorPlugin extends FrameProcessorPlugin {

    FaceDetectorOptions optionsFace =
            new FaceDetectorOptions.Builder()
                    .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
                    .setContourMode(FaceDetectorOptions.CONTOUR_MODE_ALL)
                    .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_ALL)
                    .setMinFaceSize(0.15f)
                    .build();

    FaceDetector faceDetector = FaceDetection.getClient(optionsFace);

//    private WritableMap processBoundingBox(Rect boundingBox) {
//        WritableMap bounds = Arguments.createMap();
//
//
//        bounds.putDouble("width", boundingBox.width());
//        bounds.putDouble("height", boundingBox.height());
//
//
//        bounds.putDouble("boundingCenterX", boundingBox.centerX());
//        bounds.putDouble("boundingCenterY", boundingBox.centerY());
//        bounds.putDouble("boundingExactCenterX", boundingBox.exactCenterX());
//        bounds.putDouble("boundingExactCenterY", boundingBox.exactCenterY());
//
//        return bounds;
//    }
//
//    private WritableMap  processFaceContours(Face face) {
//        // All faceContours
//        int[] faceContoursTypes =
//                new int[] {
//                        FaceContour.FACE,
//                        FaceContour.LEFT_EYEBROW_TOP,
//                        FaceContour.LEFT_EYEBROW_BOTTOM,
//                        FaceContour.RIGHT_EYEBROW_TOP,
//                        FaceContour.RIGHT_EYEBROW_BOTTOM,
//                        FaceContour.LEFT_EYE,
//                        FaceContour.RIGHT_EYE,
//                        FaceContour.UPPER_LIP_TOP,
//                        FaceContour.UPPER_LIP_BOTTOM,
//                        FaceContour.LOWER_LIP_TOP,
//                        FaceContour.LOWER_LIP_BOTTOM,
//                        FaceContour.NOSE_BRIDGE,
//                        FaceContour.NOSE_BOTTOM,
//                        FaceContour.LEFT_CHEEK,
//                        FaceContour.RIGHT_CHEEK
//                };
//
//        String[] faceContoursTypesStrings = {
//                "FACE",
//                "LEFT_EYEBROW_TOP",
//                "LEFT_EYEBROW_BOTTOM",
//                "RIGHT_EYEBROW_TOP",
//                "RIGHT_EYEBROW_BOTTOM",
//                "LEFT_EYE",
//                "RIGHT_EYE",
//                "UPPER_LIP_TOP",
//                "UPPER_LIP_BOTTOM",
//                "LOWER_LIP_TOP",
//                "LOWER_LIP_BOTTOM",
//                "NOSE_BRIDGE",
//                "NOSE_BOTTOM",
//                "LEFT_CHEEK",
//                "RIGHT_CHEEK"
//        };
//
//        WritableMap faceContoursTypesMap = new WritableNativeMap();
//
//        for (int i = 0; i < faceContoursTypesStrings.length; i++) {
//            FaceContour contour = face.getContour(faceContoursTypes[i]);
//            List<PointF> points = contour.getPoints();
//            WritableNativeArray pointsArray = new WritableNativeArray();
//
//            for (int j = 0; j < points.size(); j++) {
//                WritableMap currentPointsMap = new WritableNativeMap();
//
//                currentPointsMap.putDouble("x", points.get(j).x);
//                currentPointsMap.putDouble("y", points.get(j).y);
//
//                pointsArray.pushMap(currentPointsMap);
//            }
//            faceContoursTypesMap.putArray(faceContoursTypesStrings[contour.getFaceContourType() - 1], pointsArray);
//        }
//
//        return faceContoursTypesMap;
//    }




  @Override
  public Object callback(@NonNull Frame frame, @Nullable Map<String, Object> params) {

      @SuppressLint("UnsafeOptInUsageError")
      Image mediaImage = frame.getImage();

      Map<String, String> map = new HashMap<>();
      if (mediaImage != null) {
          InputImage image = InputImage.fromMediaImage(mediaImage, 270);
          Task<List<Face>> task = faceDetector.process(image);
        //  WritableNativeArray array = new WritableNativeArray();
         // WritableMap map =  new WritableNativeMap();

          try {
              List<Face> faces = Tasks.await(task);
              for (Face face : faces) {
                 

//                  map.put("rollAngle", face.getHeadEulerAngleZ()); // Head is rotated to the left rotZ degrees
//                  map.putDouble("pitchAngle", face.getHeadEulerAngleX()); // Head is rotated to the right rotX degrees
//                  map.putDouble("yawAngle", face.getHeadEulerAngleY());  // Head is tilted sideways rotY degrees
//                  map.putDouble("leftEyeOpenProbability", face.getLeftEyeOpenProbability());
//                  map.putDouble("rightEyeOpenProbability", face.getRightEyeOpenProbability());
//                  map.putDouble("smilingProbability", face.getSmilingProbability());

                  map.put("rollAngle", Float.toString(face.getHeadEulerAngleZ()));
                  map.put("pitchAngle", Float.toString(face.getHeadEulerAngleX()));
                  map.put("yawAngle", Float.toString(face.getHeadEulerAngleY()));
                  map.put("eyeOpenProbability", face.getLeftEyeOpenProbability().toString());
                  map.put("smiling", face.getSmilingProbability().toString());

                  return map;
              }
            //  map.put("example_array", task.toString());
             // return map;
          } catch (Exception e) {
              e.printStackTrace();
          }
      }

      return null;
  }

   FaceDetectorFrameProcessorPlugin(@Nullable Map<String, Object> options) {
        super(options);
        Log.d("ExamplePlugin", "ExampleFrameProcessorPlugin initialized with options: " + options);
    }
}