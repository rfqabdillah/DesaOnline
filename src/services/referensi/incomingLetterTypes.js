import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getIncomingLetterTypes = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'jenis-surat-masuk',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} incomingLetterTypeId
 */
export const getDetailIncomingLetterType = (incomingLetterTypeId) => {
  if (!incomingLetterTypeId) {
    return Promise.reject(new Error("ID jenis surat masuk tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'jenis-surat-masuk',
      key: incomingLetterTypeId,
    },
  });
};

/**
 * Membuat/menambah baru.
 * @param {Object} incomingLetterTypeData 
 */
export const addIncomingLetterType = (incomingLetterTypeData) =>
  apiClient.post('', {
    act: 'jenis-surat-masuk',
    record: incomingLetterTypeData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} incomingLetterTypeId 
 * @param {Object} incomingLetterTypeData 
 */
export const updateIncomingLetterType = (incomingLetterTypeId, incomingLetterTypeData) => {
  if (!incomingLetterTypeId) {
    return Promise.reject(new Error("ID jenis surat masuk tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'jenis-surat-masuk',
    key: incomingLetterTypeId,
    record: incomingLetterTypeData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} incomingLetterTypeId
 */
export const deleteIncomingLetterType = (incomingLetterTypeId) => {
  if (!incomingLetterTypeId) {
    return Promise.reject(new Error("ID jenis surat masuk tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'jenis-surat-masuk',
      key: incomingLetterTypeId,
    },
  });
};