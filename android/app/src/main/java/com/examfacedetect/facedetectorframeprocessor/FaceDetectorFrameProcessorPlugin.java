package com.examfacedetect.facedetectorframeprocessor;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.mrousavy.camera.frameprocessor.Frame;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;
import java.util.Map;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import android.util.Log;

public class FaceDetectorFrameProcessorPlugin extends FrameProcessorPlugin {
  @Override
  public Object callback(@NonNull Frame frame, @Nullable Map<String, Object> arguments) {
    // code goes here
   
        Map<String, Object> map = new HashMap<>();
        map.put("example_str", "Test");
        map.put("example_bool", true);
        map.put("example_double", 5.3);

        List<Object> array = new ArrayList<>();
        array.add("Hello!");
        array.add(true);
        array.add(17.38);

        map.put("example_array", array);
        return map;
  }

   FaceDetectorFrameProcessorPlugin(@Nullable Map<String, Object> options) {
        super(options);
        Log.d("ExamplePlugin", "ExampleFrameProcessorPlugin initialized with options: " + options);
    }
}