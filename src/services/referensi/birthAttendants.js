import apiClient from '../users'; 

/**
 * Mengambil daftar region
 * @param {Object} params 
 */

export const getBirthAttendants = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'penolong-kelahiran',
      ...params,
    },
  });

/**
 * Mengambil detail satu region berdasarkan ID-nya.
 * @param {string|number} birthAttendantId
 */
export const getDetailBirthAttendant = (birthAttendantId) => {
  if (!birthAttendantId) {
    return Promise.reject(new Error("ID Penolong Kelahiran tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'penolong-kelahiran',
      key: birthAttendantId,
    },
  });
};

/**
 * Membuat/menambah region baru.
 * @param {Object} birthAttendantData 
 */
export const addBirthAttendant = (birthAttendantData) =>
  apiClient.post('', {
    act: 'penolong-kelahiran',
    record: birthAttendantData,
  });

/**
 * Memperbarui region yang ada berdasarkan ID-nya.
 * @param {string|number} birthAttendantId 
 * @param {Object} birthAttendantData 
 */
export const updateBirthAttendant = (birthAttendantId, birthAttendantData) => {
  if (!birthAttendantId) {
    return Promise.reject(new Error("ID Penolong Kelahiran tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'penolong-kelahiran',
    key: birthAttendantId,
    record: birthAttendantData,
  });
};

/**
 * Menghapus region berdasarkan ID-nya.
 * @param {string|number} birthAttendantId
 */
export const deleteBirthAttendant = (birthAttendantId) => {
  if (!birthAttendantId) {
    return Promise.reject(new Error("ID Penolong Kelahiran tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'penolong-kelahiran',
      key: birthAttendantId,
    },
  });
};