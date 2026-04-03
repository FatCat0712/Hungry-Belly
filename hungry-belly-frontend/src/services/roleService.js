import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/roles";

export const fetchRolesApi = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  return data.data;
};

export const fetchRoleWithIdApi = async (roleId) => {
  const res = await fetch(`${API_URL}/${roleId}`);
  const data = await res.json();
  return data.data;
};

// export const createRoleApi = async (roleData) => {
//   const res = await fetch(API_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(roleData),
//   });
//   if (!res.ok) throw new Error("Failed to create role");
//   return res.json();
// };

export const updateRoleApi = async (roleData) => {
  const res = await axios.put(`${API_URL}`, roleData, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
};

// export const deleteRoleApi = async (roleId) => {
//   const res = await fetch(`${API_URL}/${roleId}`, {
//     method: "DELETE",
//   });
//   if (!res.ok) throw new Error("Failed to delete role");
//   return res.json();
// };
