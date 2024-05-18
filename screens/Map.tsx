import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import fetchMapData from '../src/api/api';
import {useDispatch, useSelector} from 'react-redux';
import {MarkerIcon, Close} from '../src/components/svg';
import {moderateScale} from 'react-native-size-matters';
import SaveConfirmationModal from '../src/components/SaveConfirmationModal';
import {saveLocation, selectSavedLocations} from '../src/redux/mapSlice';
import {fetchPlaceName} from '../src/apis/googleApi';
import { useRoute } from '@react-navigation/native';

export default function ScreenMap() {
  const route = useRoute();
  const { selectedLocation: initialSelectedLocation } = route.params || {};
  const dispatch = useDispatch();
  const savedLocations = useSelector(selectSavedLocations);
  const [placeName, setPlaceName] = useState('');
  const [markers, setMarkers] = useState([ {
    title: '',
    address: '',
    coordinates: {
      latitude: '',
      longitude: '',
    },
  }])

  const [marker, setMarker] = useState([]);
  // const [selectedLocation, setSelectedLocation] = useState(initialSelectedLocation || {
  //   latitude: 10.6675076,
  //   longitude: 75.9899908994804,
  // });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaveModalVisible, setSaveModalVisible] = useState(false);
  const [closeIcon, setCloseIcon] = useState(false);

  const handleMapPress = event => {
    const {coordinate, title} = event.nativeEvent;
    setSelectedLocation({...coordinate, title});
    setShowModal(true);
  };

  useEffect(() => {
    if (initialSelectedLocation) {
      setSelectedLocation(initialSelectedLocation);
    } else {
      setSelectedLocation({
        latitude: 10.6675076,
        longitude: 75.9899908994804,
      });
    }
  }, [initialSelectedLocation]);

  useEffect(() => {
    if (selectedLocation) {
      fetchPlaceName(
        selectedLocation.latitude,
        selectedLocation.longitude,
  ).then(result => setPlaceName(result));
    }
  }, [selectedLocation]);

  const handleSavePress = () => {
    setSaveModalVisible(true);
  };


  const handleSaveConfirmation = () => {
    const locationData = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: placeName,
      time: currentTime,
    };
    dispatch(saveLocation(locationData));
    Alert.alert('Saved!', 'Location has been saved successfully.');
    setSaveModalVisible(false);
  };

  const handleCancelSave = () => {
    setSaveModalVisible(false);
  };

  const currentTime = new Date().toLocaleString();

  return (
    <View style={styles.body}>
      {/* {isLoading ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator />
          <ActivityIndicator size="large" />
        </View>
      ) : ( */}
      <>
        <Text style={styles.headingText}>Map View </Text>
        <MapView
          style={styles.map}
          initialRegion={{
            // latitude: 10.667565249999999,
            // longitude: 75.9899908994804,
             latitude: selectedLocation ? selectedLocation.latitude : 10.6675076,
          longitude: selectedLocation ? selectedLocation.longitude : 75.9899908994804,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          zoomEnabled={true}
          showsUserLocation={true}
          followsUserLocation={true}
          showsCompass={true}
          onPress={handleMapPress}>
          {selectedLocation && (
            <Marker
              style={{position: 'relative'}}
              coordinate={selectedLocation}
              title={`Lat: ${selectedLocation.latitude.toFixed(5)}`}
              description={`Lon: ${selectedLocation.longitude.toFixed(5)}`}
            />
          )}
        </MapView>
        {selectedLocation && (
          <View
            style={styles.detailsBox}>
            <Text
              style={styles.markerHeading}>
              Marker Details
            </Text>
            <Text style={styles.itemTextStyle}>Place Address: {placeName}</Text>
            <Text style={styles.itemTextStyle}>
              Latitude: {selectedLocation?.latitude.toFixed(5)}
            </Text>
            <Text style={styles.itemTextStyle}>
              Longitude: {selectedLocation?.longitude.toFixed(5)}
            </Text>
            <Text style={styles.itemTextStyle}>Time: {currentTime}</Text>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={handleSavePress}
                style={styles.saveBox}>
                <Text style={{fontWeight: 'bold', textAlign: 'center', color:'#fff',padding:3}}>
                  SAVE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </>
      <SaveConfirmationModal
        isVisible={isSaveModalVisible}
        onOk={handleSaveConfirmation}
        onCancel={handleCancelSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#a8cbf0',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  headingText: {
    height: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: moderateScale(18),
    color: '#000',
    marginVertical: moderateScale(15),
    textAlign: 'center',
  },
  detailsBox:{
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    elevation: 5,
    borderColor: '#c7ced9',
    borderWidth: 1,
  },
  saveBox:{
    backgroundColor: '#8aade3',
    width: '15%',
    padding: moderateScale(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: moderateScale(8),
  }, 
  itemTextStyle:{textAlign: 'center', color: '#000'},
  markerHeading:{
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    paddingBottom: moderateScale(8),
  }
});
