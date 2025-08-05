import apiClient from '../../users';

/**
 * Mengambil daftar kendaraan.
 * @param {Object} params 
 */
export const getVehicles = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'kendaraan',
      ...params,
    },
  });

/**
 * Mengambil detail satu kendaraan berdasarkan ID-nya.
 * @param {string|number} vehicleId 
 */
export const getDetailVehicle = (vehicleId) => {
  if (!vehicleId) {
    return Promise.reject(new Error("ID kendaraan tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'kendaraan',
      key: vehicleId,
    },
  });
};

/**
 * Menambah kendaraan baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addVehicle = (formData) => {
  formData.append('act', 'kendaraan');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data kendaraan yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} vehicleId 
 * @param {FormData} formData 
 */
export const updateVehicle = (vehicleId, formData) => {
  if (!vehicleId) {
    return Promise.reject(new Error("ID kendaraan tidak tersedia."));
  }
  formData.append('act', 'kendaraan');
  formData.append('key', vehicleId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data kendaraan berdasarkan ID-nya.
 * @param {string|number} vehicleId
 */
export const deleteVehicle = (vehicleId) => {
  if (!vehicleId) {
    return Promise.reject(new Error("ID kendaraan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'kendaraan',
      key: vehicleId,
    },
  });
};