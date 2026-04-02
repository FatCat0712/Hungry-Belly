const API_URL = import.meta.env.VITE_API_URL + "/roles";

export const fetchRolesApi = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  return data.data;
};

// export const fetchPermissionsApi = async () => {
//   const res = await fetch(`${API_URL}/permissions`);
//   const data = await res.json();
//   return data.data;
// };

// export const createRoleApi = async (roleData) => {
//   const res = await fetch(API_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(roleData),
//   });
//   if (!res.ok) throw new Error("Failed to create role");
//   return res.json();
// };

// export const updateRoleApi = async (roleId, roleData) => {
//   const res = await fetch(`${API_URL}/${roleId}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(roleData),
//   });
//   if (!res.ok) throw new Error("Failed to update role");
//   return res.json();
// };

// export const deleteRoleApi = async (roleId) => {
//   const res = await fetch(`${API_URL}/${roleId}`, {
//     method: "DELETE",
//   });
//   if (!res.ok) throw new Error("Failed to delete role");
//   return res.json();
// };
