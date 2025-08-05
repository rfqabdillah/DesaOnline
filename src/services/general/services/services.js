import apiClient from '../../users';

/**
 * Mengambil daftar layanan.
 * @param {Object} params 
 */
export const getServices = (params = {}) =>
  apiClient.get('', {
    params: {
      act: 'layanan',
      ...params,
    },
  });

/**
 * Mengambil detail satu layanan berdasarkan ID-nya.
 * @param {string|number} serviceId 
 */
export const getDetailService = (serviceId) => {
  if (!serviceId) {
    return Promise.reject(new Error("ID layanan tidak tersedia."));
  }
  return apiClient.get('', {
    params: {
      act: 'layanan',
      key: serviceId,
    },
  });
};

/**
 * Menambah layanan baru menggunakan FormData.
 * @param {FormData} formData 
 */
export const addService = (formData) => {
  formData.append('act', 'layanan');
  return apiClient.post('', formData);
};

/**
 * Memperbarui data layanan yang ada berdasarkan ID-nya menggunakan FormData.
 * @param {string|number} serviceId 
 * @param {FormData} formData 
 */
export const updateService = (serviceId, formData) => {
  if (!serviceId) {
    return Promise.reject(new Error("ID layanan tidak tersedia."));
  }
  formData.append('act', 'layanan');
  formData.append('key', serviceId);

  return apiClient.post('', formData);
};

/**
 * Menghapus data layanan berdasarkan ID-nya.
 * @param {string|number} serviceId
 */
export const deleteService = (serviceId) => {
  if (!serviceId) {
    return Promise.reject(new Error("ID layanan tidak tersedia."));
  }
  return apiClient.delete('', {
    data: {
      act: 'layanan',
      key: serviceId,
    },
  });
};