import React from 'react';
import RNSimpleNativeGeofencing from 'react-native-simple-native-geofencing';
module.exports = async (taskData) => {
  //taskData.remainingTime tells you the remaining time of the geofencing
  // so you can reuse it to update yours
  console.log(taskData);
  debugger;
  // do stuff
  // RNSimpleNativeGeofencing.updateGeofences(
  //   newGeofencesArray,
  //   taskData.remainingTime
  // );
};