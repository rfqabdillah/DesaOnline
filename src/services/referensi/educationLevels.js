import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getEducationLevels = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'pendidikan',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} educationLevelId
 */
export const getDetailEducationLevel = (educationLevelId) => {
  if (!educationLevelId) {
    return Promise.reject(new Error("ID pendidikan tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'pendidikan',
      key: educationLevelId,
    },
  });
};

/**
 * Membuat/menambah region baru.
 * @param {Object} educationLevelData 
 */
export const addEducationLevel = (educationLevelData) =>
  apiClient.post('', {
    act: 'pendidikan',
    record: educationLevelData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} educationLevelId 
 * @param {Object} educationLevelData 
 */
export const updateEducationLevel = (educationLevelId, educationLevelData) => {
  if (!educationLevelId) {
    return Promise.reject(new Error("ID pendidikan tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'pendidikan',
    key: educationLevelId,
    record: educationLevelData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} educationLevelId
 */
export const deleteEducationLevel = (educationLevelId) => {
  if (!educationLevelId) {
    return Promise.reject(new Error("ID pendidikan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'pendidikan',
      key: educationLevelId,
    },
  });
};