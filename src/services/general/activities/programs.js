import apiClient from '../../users';

/**
 * Mengambil daftar kegiatan.
 * @param {Object} params 
 */
export const getPrograms = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'kegiatan',
      ...params,
    },
  });

/**
 * Mengambil detail satu kegiatan berdasarkan ID-nya.
 * @param {string|number} programId 
 */
export const getDetailProgram = (programId) => {
  if (!programId) {
    return Promise.reject(new Error("ID kegiatan tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'kegiatan',
      key: programId,
    },
  });
};

/**
 * Menambah kegiatan baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addProgram = (formData) => {
  formData.append('act', 'kegiatan');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data kegiatan yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} programId 
 * @param {FormData} formData 
 */
export const updateProgram = (programId, formData) => {
  if (!programId) {
    return Promise.reject(new Error("ID kegiatan tidak tersedia."));
  }
  formData.append('act', 'kegiatan');
  formData.append('key', programId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data kegiatan berdasarkan ID-nya.
 * @param {string|number} programId
 */
export const deleteProgram = (programId) => {
  if (!programId) {
    return Promise.reject(new Error("ID kegiatan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'kegiatan',
      key: programId,
    },
  });
};