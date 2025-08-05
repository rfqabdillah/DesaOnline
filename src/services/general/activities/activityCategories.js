import apiClient from '../../users';

/**
 * Mengambil daftar kategori kegiatan.
 * @param {Object} params 
 */
export const getCategories = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'kategori-kegiatan',
      ...params,
    },
  });

/**
 * Mengambil detail satu kategori kegiatan berdasarkan ID-nya.
 * @param {string|number} programId 
 */
export const getDetailCategory = (programId) => {
  if (!programId) {
    return Promise.reject(new Error("ID kategori kegiatan tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'kategori-kegiatan',
      key: programId,
    },
  });
};

/**
 * Menambah kategori kegiatan baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addCategory = (formData) => {
  formData.append('act', 'kategori-kegiatan');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data kategori kegiatan yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} programId 
 * @param {FormData} formData 
 */
export const updateCategory = (programId, formData) => {
  if (!programId) {
    return Promise.reject(new Error("ID kategori kegiatan tidak tersedia."));
  }
  formData.append('act', 'kategori-kegiatan');
  formData.append('key', programId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data kategori kegiatan berdasarkan ID-nya.
 * @param {string|number} programId
 */
export const deleteCategory = (programId) => {
  if (!programId) {
    return Promise.reject(new Error("ID kategori kegiatan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'kategori-kegiatan',
      key: programId,
    },
  });
};