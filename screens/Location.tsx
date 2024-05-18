import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import React,{useRef} from 'react';
import {moderateScale} from 'react-native-size-matters';
import {useSelector, useDispatch} from 'react-redux';
import {selectSavedLocations, removeLocation,saveLocation} from '../src/redux/mapSlice';
import {Guide, Close} from '../src/components/svg';
import {useNavigation,useFocusEffect } from '@react-navigation/native';

function ScreenLocation() {
  const savedLocations = useSelector(selectSavedLocations);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const selectedLocationRef = useRef(null);


  const handleContainerClick = location => {
    selectedLocationRef.current = location;
    // Navigate to the map view page with the selected location
    navigation.navigate('Map', {selectedLocation:location});
  };

  const handleRemoveLocation = locationTime => {
    dispatch(removeLocation(locationTime));
    Alert.alert('Removed!', 'Location has been removed successfully.');
  };

  const renderLocationItem = ({item}) => (
    <ScrollView style={{flex: 1}}>
      <TouchableOpacity
        onPress={() => handleContainerClick(item)}
        style={styles.containerStyle}>
        <View style={styles.guide}>
          <Guide width={60} height={60} />
        </View>
        {/* <ScrollView style={{flex: 1}}> */}
          <View style={{flex: 1}}>
            <Text style={{color:'#000'}} numberOfLines={2} ellipsizeMode="tail">
              Address: {item?.address}
            </Text>
            <Text style={{color:'#000'}}>Latitude: {item?.latitude}</Text>
            <Text style={{color:'#000'}}>Longitude: {item?.longitude}</Text>
            <Text style={{color:'#000'}}>Time: {item?.time}</Text>
          </View>
        {/* </ScrollView> */}
        <TouchableOpacity
          onPress={() => handleRemoveLocation(item.time)}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: 10,
          }}>
          <Close width={10} height={10} />
        </TouchableOpacity>
      </TouchableOpacity>
     </ScrollView>
  );

  return (
    <View>
      <Text style={styles.headingText}>Saved locations</Text>
      <View>
        <FlatList
          data={savedLocations}
          keyExtractor={item => item?.time?.toString()}
          renderItem={renderLocationItem}
          extraData={savedLocations}
        />
      </View>
    </View>
  );
}

export default ScreenLocation;

const styles = StyleSheet.create({
  headingText: {
    height: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: moderateScale(18),
    color: '#000',
    marginVertical: moderateScale(20),
    textAlign: 'center',
  },
  containerStyle: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius:moderateScale(8),
    margin: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: '#c7ced9',
  },
  guide: {
    paddingRight: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
