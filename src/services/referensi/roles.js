import apiClient from '../users'; 

/**
 * Mengambil daftar roles
 * @param {Object} params 
 */

export const getRoles = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'roles',
      ...params,
    },
  });

/**
 * Mengambil detail satu roles berdasarkan ID-nya.
 * @param {string|number} rolesId 
 */
export const getDetailRoles = (rolesId) => {
  if (!rolesId) {
    return Promise.reject(new Error("ID roles tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'roles',
      key: rolesId,
    },
  });
};

/**
 * Membuat/menambah roles baru.
 * @param {Object} rolesData 
 */
export const addRoles = (rolesData) =>
  apiClient.post('', {
    act: 'roles',
    record: rolesData,
  });

/**
 * Memperbarui roles yang ada berdasarkan ID-nya.
 * @param {string|number} rolesId
 * @param {Object} rolesData
 */
export const updateRoles = (rolesId, rolesData) => {
  if (!rolesId) {
    return Promise.reject(new Error("ID roles tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'roles',
    key: rolesId,
    record: rolesData,
  });
};

/**
 * Menghapus roles berdasarkan ID-nya.
 * @param {string|number} rolesId
 */
export const deleteRoles = (rolesId) => {
  if (!rolesId) {
    return Promise.reject(new Error("ID roles tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'roles',
      key: rolesId,
    },
  });
};