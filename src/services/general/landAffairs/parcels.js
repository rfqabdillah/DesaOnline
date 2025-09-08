import apiClient from '../../users';

/**
 * Mengambil daftar persil.
 * @param {Object} params 
 */
export const getParcels = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'persil',
      ...params,
    },
  });

/**
 * Mengambil detail satu persil berdasarkan ID-nya.
 * @param {string|number} parcelId 
 */
export const getDetailParcel = (parcelId) => {
  if (!parcelId) {
    return Promise.reject(new Error("ID persil tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'persil',
      key: parcelId,
    },
  });
};

/**
 * Menambah persil baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addParcel = (formData) => {
  formData.append('act', 'persil');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data persil yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} parcelId 
 * @param {FormData} formData 
 */
export const updateParcel = (parcelId, formData) => {
  if (!parcelId) {
    return Promise.reject(new Error("ID persil tidak tersedia."));
  }
  formData.append('act', 'persil');
  formData.append('key', parcelId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data persil berdasarkan ID-nya.
 * @param {string|number} parcelId
 */
export const deleteParcel = (parcelId) => {
  if (!parcelId) {
    return Promise.reject(new Error("ID persil tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'persil',
      key: parcelId,
    },
  });
};