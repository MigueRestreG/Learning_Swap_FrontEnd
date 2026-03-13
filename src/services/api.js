const API_URL = "https://learning-swap.vercel.app";

// Helper para manejar respuestas
async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud");
  }

  return data;
}

// LOGIN
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await handleResponse(response);

  // Guardar token
  localStorage.setItem("token", data.token);

  return data;
}

// REGISTER
export async function registerUser(first_name, last_name, email, password, phone) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      first_name,
      last_name,
      email,
      password,
      phone
    })
  });

  return handleResponse(response);
}
