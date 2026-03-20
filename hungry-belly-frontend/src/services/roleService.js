const API_URL = import.meta.env.VITE_API_URL + "/roles";

export const fetchRolesApi = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  return data.data;
};
