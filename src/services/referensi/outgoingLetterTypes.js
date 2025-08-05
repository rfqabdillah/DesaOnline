import apiClient from '../users'; 

/**
 * Mengambil daftar 
 * @param {Object} params 
 */

export const getOutgoingLetterTypes = (params = {}) =>
  apiClient.get('', { 
    params: {
      act: 'jenis-surat-keluar',
      ...params,
    },
  });

/**
 * Mengambil detail berdasarkan ID-nya.
 * @param {string|number} outgoingLetterTypeId
 */
export const getDetailOutgoingLetterType = (outgoingLetterTypeId) => {
  if (!outgoingLetterTypeId) {
    return Promise.reject(new Error("ID jenis surat keluar tidak disediakan."));
  }
  return apiClient.get('', {
    params: {
      act: 'jenis-surat-keluar',
      key: outgoingLetterTypeId,
    },
  });
};

/**
 * Membuat/menambah baru.
 * @param {Object} outgoingLetterTypeData 
 */
export const addOutgoingLetterType = (outgoingLetterTypeData) =>
  apiClient.post('', {
    act: 'jenis-surat-keluar',
    record: outgoingLetterTypeData,
  });

/**
 * Memperbarui berdasarkan ID-nya.
 * @param {string|number} outgoingLetterTypeId 
 * @param {Object} outgoingLetterTypeData 
 */
export const updateOutgoingLetterType = (outgoingLetterTypeId, outgoingLetterTypeData) => {
  if (!outgoingLetterTypeId) {
    return Promise.reject(new Error("ID jenis surat keluar tidak tersedia."));
  }
  return apiClient.put('', {
    act: 'jenis-surat-keluar',
    key: outgoingLetterTypeId,
    record: outgoingLetterTypeData,
  });
};

/**
 * Menghapus berdasarkan ID-nya.
 * @param {string|number} outgoingLetterTypeId
 */
export const deleteOutgoingLetterType = (outgoingLetterTypeId) => {
  if (!outgoingLetterTypeId) {
    return Promise.reject(new Error("ID jenis surat keluar tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'jenis-surat-keluar',
      key: outgoingLetterTypeId,
    },
  });
};