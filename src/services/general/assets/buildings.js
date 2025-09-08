import apiClient from '../../users';

/**
 * Mengambil daftar bangunan.
 * @param {Object} params 
 */
export const getBuildings = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'gedung',
      ...params,
    },
  });

/**
 * Mengambil detail satu bangunan berdasarkan ID-nya.
 * @param {string|number} buildingId 
 */
export const getDetailBuilding = (buildingId) => {
  if (!buildingId) {
    return Promise.reject(new Error("ID bangunan tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'gedung',
      key: buildingId,
    },
  });
};

/**
 * Menambah bangunan baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addBuilding = (formData) => {
  formData.append('act', 'gedung');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data bangunan yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} buildingId 
 * @param {FormData} formData 
 */
export const updateBuilding = (buildingId, formData) => {
  if (!buildingId) {
    return Promise.reject(new Error("ID bangunan tidak tersedia."));
  }
  formData.append('act', 'gedung');
  formData.append('key', buildingId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data bangunan berdasarkan ID-nya.
 * @param {string|number} buildingId
 */
export const deleteBuilding = (buildingId) => {
  if (!buildingId) {
    return Promise.reject(new Error("ID bangunan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'gedung',
      key: buildingId,
    },
  });
};