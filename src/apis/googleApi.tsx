const fetchPlaceName = async (latitude, longitude) => {
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();


    if (data && data.address) {
      const { amenity, road, hamlet, village, county, state_district } = data.address;
      const formattedAddress = `${amenity ? amenity + ', ' : ''}${road ? road + ', ' : ''}${hamlet || village || ''}${county ? ', ' + county : ''}${state_district ? ', ' + state_district : ''}`.trim();
      return formattedAddress || 'Place name not available';
    } else {
      return 'Place name not available';
    }
  } catch (error) {
    console.error('Error fetching place name:', error);
    return 'Error fetching place name';
  }
};

export { fetchPlaceName  };