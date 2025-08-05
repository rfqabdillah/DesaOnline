import apiClient from '../../users';

/**
 * Mengambil daftar pengumuman.
 * @param {Object} params 
 */
export const getNotices = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'pengumuman',
      ...params,
    },
  });

/**
 * Mengambil detail satu pengumuman berdasarkan ID-nya.
 * @param {string|number} noticeId 
 */
export const getDetailNotice = (noticeId) => {
  if (!noticeId) {
    return Promise.reject(new Error("ID pengumuman tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'pengumuman',
      key: noticeId,
    },
  });
};

/**
 * Menambah pengumuman baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addNotice = (formData) => {
  formData.append('act', 'pengumuman');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data pengumuman yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} noticeId 
 * @param {FormData} formData 
 */
export const updateNotice = (noticeId, formData) => {
  if (!noticeId) {
    return Promise.reject(new Error("ID pengumuman tidak tersedia."));
  }
  formData.append('act', 'pengumuman');
  formData.append('key', noticeId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data pengumuman berdasarkan ID-nya.
 * @param {string|number} noticeId
 */
export const deleteNotice = (noticeId) => {
  if (!noticeId) {
    return Promise.reject(new Error("ID pengumuman tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'pengumuman',
      key: noticeId,
    },
  });
};