import React, { useEffect, useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  latitude?: number;
  longitude?: number;
  title?: string;
}

const MapModal: React.FC<MapModalProps> = ({
  visible,
  onClose,
  latitude = 21.0278,
  longitude = 105.8342,
  title = 'Hà Nội',
}) => {
  const [marker, setMarker] = useState<{ lat: number; lng: number }>({
    lat: latitude,
    lng: longitude,
  });

  useEffect(() => {
    setMarker({
      lat: latitude,
      lng: longitude,
    });
  }, [latitude, longitude]); // Chạy khi latitude hoặc longitude thay đổi

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ lat: latitude, lng: longitude });
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1 }}>
        {/* nút đóng */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={{ color: 'white' }}>Đóng</Text>
        </TouchableOpacity>

        {/* Map full-screen */}
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleMapPress} // ✅ truyền trực tiếp event
        >
          <Marker
            coordinate={{ latitude: marker.lat, longitude: marker.lng }} // ✅ dùng state
            title="Vị trí đã chọn"
          />
        </MapView>
      </View>
    </Modal>
  );
};

export default MapModal;

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: '#000000aa',
    padding: 10,
    borderRadius: 20,
  },
});
