import React, {Component} from 'react';
import {Text, View, Platform, Button} from 'react-native';
// import Boundary, {Events} from 'react-native-boundary';
import RNSimpleNativeGeofencing from 'react-native-simple-native-geofencing';

import {PermissionsAndroid} from 'react-native';

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location permission',
        'message': 'Needed obviously'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Granted Permission")
    } else {
      console.log("Denied Permission")
    }
  } catch (err) {
    console.warn(err)
  }
}

export default class HelloWorldApp extends Component {
  componentWillMount() {
    //see above
    if (Platform.OS === 'android') {
      requestLocationPermission();
    }
  }
  componentDidMount() {
    debugger;
    //set up Notifications
    RNSimpleNativeGeofencing.initNotification({
      channel: {
        title: "Message Channel Title",
        description: "Message Channel Description"
      },
      start: {
        notify: true,
        title: "Start Tracking",
        description: "You are now tracked"
      },
      stop: {
        notify: true,
        title: "Stopped Tracking",
        description: "You are not tracked any longer"
      },
      enter: {
        notify: true,
        title: "Attention",
        //[value] will be replaced ob geofences' value attribute
        description: "You entered a [value] Zone"
      },
      exit: {
        notify: true,
        title: "Left Zone",
        description: "You left a [value] Zone"
      },
    });
  }
  fail() {
    console.log("Fail to start geofencing")
  }
  startMonitoring() {
    debugger;
    let geofences = [
      {
        key: "geoNum1",
        latitude: 38.9204,
        longitude: -77.0175,
        radius: 5000,
        value: "yellow"
      },
      {
        key: "geoNum2",
        latitude: 38.9248,
        longitude: -77.0258,
        radius: 5000,
        value: "green"
      },
      {
        key: "geoNum3",
        latitude: 47.423,
        longitude: -122.084,
        radius: 1500,
        value: "red"
      },
    ];
    RNSimpleNativeGeofencing.addGeofences(geofences, 3000000, this.fail);
  }

  stopMonitoring() {
    RNSimpleNativeGeofencing.removeAllGeofences();
  }
  render() {
    // this.startMonitoring();
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Start Monitoring" onPress={this.startMonitoring} />
        <Button title="Stop Monitoring" onPress={this.stopMonitoring} />
      </View>
    );
  }
}
