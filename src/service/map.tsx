import axios from 'axios';

export const getLocation = async (location: string) => {
  try {
    // ✅ Tạo axios instance riêng, không dùng apiClient
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: location,
          format: 'json',
          addressdetails: 1,
          limit: 1,
        },
        headers: {
          'User-Agent': 'BatDongSanApp/1.0', // ✅ Nominatim yêu cầu User-Agent
        },
      },
    );

    if (response.data && response.data.length > 0) {
      const { lat, lon, display_name } = response.data[0];
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lon),
        displayName: display_name,
        data: response.data[0],
      };
    } else {
      throw new Error('No results found for this location');
    }
  } catch (error: any) {
    console.error(
      'Error fetching location:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
