
 const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const checkTenant = async (accountId: string) => {
  const res = await fetch(
    `${API_BASE}/api/v1/login/check-tenant?type=id&value=${accountId}`
  );
  console.log(res,'res')

  const data = await res.json();
  if (!res.ok || !data.data?.exists) {
    throw new Error("Tenant not found");
  }
 console.log(data.data.access_token)
  return data.data.access_token; // tenant token
};

export const validateLogin = async (
  tenantToken: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${API_BASE}/api/v1/login/validate-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-token": tenantToken, // ✅ CORRECT HEADER
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log("LOGIN API:", data);

  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

