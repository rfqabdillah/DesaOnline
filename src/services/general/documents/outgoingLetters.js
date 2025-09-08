import apiClient from '../../users';

/**
 * Mengambil daftar surat keluar.
 * @param {Object} params 
 */
export const getOutgoingLetters = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'surat-keluar',
      ...params,
    },
  });

/**
 * Mengambil detail satu surat keluar berdasarkan ID-nya.
 * @param {string|number} outgoingLetterId 
 */
export const getDetailOutgoingLetter = (outgoingLetterId) => {
  if (!outgoingLetterId) {
    return Promise.reject(new Error("ID surat keluar tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'surat-keluar',
      key: outgoingLetterId,
    },
  });
};

/**
 * Menambah surat keluar baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addOutgoingLetter = (formData) => {
  formData.append('act', 'surat-keluar');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data surat keluar yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} outgoingLetterId 
 * @param {FormData} formData 
 */
export const updateOutgoingLetter = (outgoingLetterId, formData) => {
  if (!outgoingLetterId) {
    return Promise.reject(new Error("ID surat keluar tidak tersedia."));
  }
  formData.append('act', 'surat-keluar');
  formData.append('key', outgoingLetterId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data surat keluar berdasarkan ID-nya.
 * @param {string|number} outgoingLetterId
 */
export const deleteOutgoingLetter = (outgoingLetterId) => {
  if (!outgoingLetterId) {
    return Promise.reject(new Error("ID surat keluar tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'surat-keluar',
      key: outgoingLetterId,
    },
  });
};