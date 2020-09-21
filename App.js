import React, {Component, Alert} from 'react';
import {Text, View, Platform, Button, StyleSheet, Image,TextInput} from 'react-native';
// import Boundary, {Events} from 'react-native-boundary';
import RNSimpleNativeGeofencing from 'react-native-simple-native-geofencing';
import Geolocation from '@react-native-community/geolocation';

import {PermissionsAndroid} from 'react-native';

const checkPermissionsResponse = (res) => Object.keys(res).reduce((acc, key) => {
  if (!acc) {
    return false;
  }

  return res[key] === PermissionsAndroid.RESULTS.GRANTED;
}, true);

async function requestLocationPermission() {
  try {
    const res = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      "android.permission.ACCESS_BACKGROUND_LOCATION"
    ]);

    if (!checkPermissionsResponse(res)) {
      console.log('permission check failed', JSON.stringify(res, null, 2));
    } else {
      console.log('permission check succeeded');
    }
  } catch (err) {
    console.warn(err)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  boldText: {
    fontSize: 30,
    color: 'red',
  },
});

export default class HelloWorldApp extends Component {
  state = {
    currentLongitude: null, //Initial Longitude
    currentLatitude: null, //Initial Latitude,
    radius: null,
    geofencesTest: [
      {
        key: 'geoNum1',
        latitude: 38.9204,
        longitude: -77.0175,
        radius: 5000,
        value: 'yellow',
      },
      {
        key: 'geoNum2',
        latitude: 38.9248,
        longitude: -77.0258,
        radius: 5000,
        value: 'green',
      },
      {
        key: 'geoNum3',
        latitude: 47.423,
        longitude: -122.084,
        radius: 1500,
        value: 'red',
      },
    ],
    geofence: {
      key: 'yourLocation',
      latitude: 38.9204,
      longitude: -77.0175,
      radius: 5000,
      value: 'yourLocation',
    },
  };

  componentWillMount() {
    //see above
    if (Platform.OS === 'android') {
      console.log('CALLING PERMISSION CHECK!');
      requestLocationPermission();
    } else {
      console.log('NOT ON ANDROID');
    }
  }
  componentDidMount() {
    //set up Notifications
    RNSimpleNativeGeofencing.initNotification({
      channel: {
        title: 'Message Channel Title',
        description: 'Message Channel Description',
      },
      start: {
        notify: true,
        title: 'Start Tracking',
        description: 'You are now tracked',
      },
      stop: {
        notify: true,
        title: 'Stopped Tracking',
        description: 'You are not tracked any longer',
      },
      enter: {
        notify: true,
        title: 'Attention',
        //[value] will be replaced ob geofences' value attribute
        description: 'You entered a [value] Zone',
      },
      exit: {
        notify: true,
        title: 'Left Zone',
        description: 'You left a [value] Zone',
      },
    });
  }

  fail() {
    console.log('Fail to start geofencing');
  }

  monitorLocation() {
    const {currentLatitude, currentLongitude, radius} = this.state;
    if (currentLatitude || currentLongitude || radius) {
      RNSimpleNativeGeofencing.addGeofences(
        [
          {
            key: 'yourLocation',
            latitude: Number(currentLatitude),
            longitude: Number(currentLongitude),
            radius: Number(radius),
            value: 'yourLocation',
          },
        ],
        3000000,
        this.fail,
      );
    }
  }

  startMonitoring() {
    let geofences = [
      {
        key: 'geoNum1',
        latitude: 38.9204,
        longitude: -77.0175,
        radius: 5000,
        value: 'yellow',
      },
      {
        key: 'geoNum2',
        latitude: 38.9248,
        longitude: -77.0258,
        radius: 5000,
        value: 'green',
      },
      {
        key: 'geoNum3',
        latitude: 47.423,
        longitude: -122.084,
        radius: 1500,
        value: 'red',
      },
    ];
    RNSimpleNativeGeofencing.addGeofences(geofences, 3000000, this.fail);
  }

  stopMonitoring() {
    RNSimpleNativeGeofencing.removeAllGeofences();
  }
  callLocation() {
    //alert("callLocation Called");
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Longitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        console.log(position);
        //getting the Latitude from the location json
        // that.setState({ currentLongitude: currentLongitude });
        //Setting state Longitude to re re-render the Longitude Text
        // that.setState({ currentLatitude: currentLatitude });
        //Setting state Latitude to re re-render the Longitude Text
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition((position) => {
      //Will give you the location on location change
      console.log(position);
      const currentLongitude = JSON.stringify(position.coords.longitude);
      //getting the Longitude from the location json
      const currentLatitude = JSON.stringify(position.coords.latitude);
      //getting the Latitude from the location json
      this.setState({currentLongitude: currentLongitude});
      //Setting state Longitude to re re-render the Longitude Text
      this.setState({currentLatitude: currentLatitude});
      //Setting state Latitude to re re-render the Longitude Text
    });
  }

  render() {
    // this.startMonitoring();
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.container}>
          <Text style={styles.boldText}>You are Here</Text>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Longitude: {this.state.currentLongitude}
          </Text>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Latitude: {this.state.currentLatitude}
          </Text>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Radius: {this.state.radius}
          </Text>
          <Text>Latitude:</Text>
          <TextInput
            keyboardType="number-pad"
            // eslint-disable-next-line react-native/no-inline-styles
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(value) => this.setState({currentLatitude: value})}
            value={this.state.currentLatitude}
          />
          <Text>Longitude:</Text>
          <TextInput
            keyboardType="number-pad"
            // eslint-disable-next-line react-native/no-inline-styles
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(value) => this.setState({currentLongitude: value})}
            value={this.state.currentLongitude}
          />
          <Text>Radius:</Text>
          <TextInput
            keyboardType="number-pad"
            // eslint-disable-next-line react-native/no-inline-styles
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(value) => this.setState({radius: value})}
            value={this.state.radius}
          />
        </View>
        {/* <Button title="Get my location" onPress={this.callLocation} /> */}
        {/* <Button title="Start Monitoring" onPress={this.startMonitoring} /> */}
        <Button
          title="Monitor location"
          onPress={this.monitorLocation.bind(this)}
        />
        {/* <Button title="Stop Monitoring" onPress={this.stopMonitoring} /> */}
      </View>
    );
  }
}
