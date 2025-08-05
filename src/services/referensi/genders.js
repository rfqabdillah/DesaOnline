import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getGenders = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'jenis-kelamin',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} genderId
 */
export const getDetailGender = (genderId) => {
  if (!genderId) {
    return Promise.reject(new Error("ID jenis kelamin tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'jenis-kelamin',
      key: genderId,
    },
  });
};

/**
 * Membuat/menambah region baru.
 * @param {Object} genderData 
 */
export const addGender = (genderData) =>
  apiClient.post('', {
    act: 'jenis-kelamin',
    record: genderData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} genderId 
 * @param {Object} genderData 
 */
export const updateGender = (genderId, genderData) => {
  if (!genderId) {
    return Promise.reject(new Error("ID jenis kelamin tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'jenis-kelamin',
    key: genderId,
    record: genderData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} genderId
 */
export const deleteGender = (genderId) => {
  if (!genderId) {
    return Promise.reject(new Error("ID jenis kelamin tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'jenis-kelamin',
      key: genderId,
    },
  });
};