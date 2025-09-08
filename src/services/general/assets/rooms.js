import apiClient from '../../users';

/**
 * Mengambil daftar ruangan.
 * @param {Object} params 
 */
export const getRooms = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'ruangan',
      ...params,
    },
  });

/**
 * Mengambil detail satu ruangan berdasarkan ID-nya.
 * @param {string|number} roomId 
 */
export const getDetailRoom = (roomId) => {
  if (!roomId) {
    return Promise.reject(new Error("ID ruangan tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'ruangan',
      key: roomId,
    },
  });
};

/**
 * Menambah ruangan baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addRoom = (formData) => {
  formData.append('act', 'ruangan');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data ruangan yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} roomId 
 * @param {FormData} formData 
 */
export const updateRoom = (roomId, formData) => {
  if (!roomId) {
    return Promise.reject(new Error("ID ruangan tidak tersedia."));
  }
  formData.append('act', 'ruangan');
  formData.append('key', roomId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data ruangan berdasarkan ID-nya.
 * @param {string|number} roomId
 */
export const deleteRoom = (roomId) => {
  if (!roomId) {
    return Promise.reject(new Error("ID ruangan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'ruangan',
      key: roomId,
    },
  });
};