import apiClient from '../../users';

/**
 * Mengambil daftar surat masuk.
 * @param {Object} params 
 */
export const getIncomingLetters = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'surat-masuk',
      ...params,
    },
  });

/**
 * Mengambil detail satu surat masuk berdasarkan ID-nya.
 * @param {string|number} incomingLetterId 
 */
export const getDetailIncomingLetter = (incomingLetterId) => {
  if (!incomingLetterId) {
    return Promise.reject(new Error("ID surat masuk tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'surat-masuk',
      key: incomingLetterId,
    },
  });
};

/**
 * Menambah surat masuk baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addIncomingLetter = (formData) => {
  formData.append('act', 'surat-masuk');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data surat masuk yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} incomingLetterId 
 * @param {FormData} formData 
 */
export const updateIncomingLetter = (incomingLetterId, formData) => {
  if (!incomingLetterId) {
    return Promise.reject(new Error("ID surat masuk tidak tersedia."));
  }
  formData.append('act', 'surat-masuk');
  formData.append('key', incomingLetterId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data surat masuk berdasarkan ID-nya.
 * @param {string|number} incomingLetterId
 */
export const deleteIncomingLetter = (incomingLetterId) => {
  if (!incomingLetterId) {
    return Promise.reject(new Error("ID surat masuk tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'surat-masuk',
      key: incomingLetterId,
    },
  });
};