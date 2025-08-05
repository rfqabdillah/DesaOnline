import apiClient from '../../users';

/**
 * Mengambil daftar kelompok.
 * @param {Object} params 
 */
export const getGroups = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'kelompok',
      ...params,
    },
  });

/**
 * Mengambil detail satu kelompok berdasarkan ID-nya.
 * @param {string|number} groupId 
 */
export const getDetailGroup = (groupId) => {
  if (!groupId) {
    return Promise.reject(new Error("ID kelompok tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'kelompok',
      key: groupId,
    },
  });
};

/**
 * Menambah kelompok baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addGroup = (formData) => {
  formData.append('act', 'kelompok');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data kelompok yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} groupId 
 * @param {FormData} formData 
 */
export const updateGroup = (groupId, formData) => {
  if (!groupId) {
    return Promise.reject(new Error("ID kelompok tidak tersedia."));
  }
  formData.append('act', 'kelompok');
  formData.append('key', groupId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data kelompok berdasarkan ID-nya.
 * @param {string|number} groupId
 */
export const deleteGroup = (groupId) => {
  if (!groupId) {
    return Promise.reject(new Error("ID kelompok tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'kelompok',
      key: groupId,
    },
  });
};