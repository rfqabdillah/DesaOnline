import apiClient from '../users'; 

/**
 * Mengambil daftar users
 * @param {Object} params 
 */

export const getUsers = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'users',
      ...params,
    },
  });

/**
 * Mengambil detail satu users berdasarkan ID-nya.
 * @param {string|number} userId 
 */
export const getDetailUsers = (userId) => {
  if (!userId) {
    return Promise.reject(new Error("ID users tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'users',
      key: userId,
    },
  });
};

/**
 * Membuat/menambah users baru.
 * @param {Object} usersData 
 */
export const addUser = (formData) => {
  formData.append('act', 'users');
  return apiClient.post('', formData);
};


/**
 * Memperbarui users yang ada berdasarkan ID-nya.
 * @param {string|number} userId
 * @param {Object} usersData
 */
export const updateUser = (userId, formData) => {
  if (!userId) {
    return Promise.reject(new Error("ID users tidak tersedia."));
  }
  formData.append('act', 'users');
  formData.append('key', userId);

  return apiClient.post('', formData);
};

/**
 * Menghapus users berdasarkan ID-nya.
 * @param {string|number} userId
 */
export const deleteUser = (userId) => {
  if (!userId) {
    return Promise.reject(new Error("ID users tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'users',
      key: userId,
    },
  });
};