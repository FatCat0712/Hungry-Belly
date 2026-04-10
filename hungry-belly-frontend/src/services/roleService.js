import api from "./api";

const API_URL = "/roles";

export const fetchRolesApi = async () => {
  const res = await api.get(API_URL);
  return res.data;
};

export const fetchRoleNamesApi = async () => {
  const res = await api.get(`${API_URL}/names`);
  return res.data;
};

export const fetchRoleWithIdApi = async (roleId) => {
  const res = await api.get(`${API_URL}/${roleId}`);
  return res.data;
};

export const createRoleApi = async (roleData) => {
  const res = await api.post(`${API_URL}`, roleData, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
};

export const updateRoleApi = async (roleData) => {
  const res = await api.put(`${API_URL}`, roleData, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
};

export const deleteRoleApi = async (roleId) => {
  const res = await api.delete(`${API_URL}/${roleId}`);
  return res.data;
};
