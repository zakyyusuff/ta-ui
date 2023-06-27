const BASE_URL = "https://golang-restoran-i2-app.herokuapp.com";
const TOKEN = localStorage.getItem("token");

const postLogin = async ({ email, password }) => {
  try {
    return await axios.post(`${BASE_URL}/users/login`, {
      email: email,
      password: password,
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const getMenus = async () => {
  try {
    return await axios.get(`${BASE_URL}/foods`, {
      headers: { token: TOKEN },
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const patchMenu = async (id, data) => {
  try {
    return await axios.patch(
      `${BASE_URL}/foods/${id}`,
      { ...data },
      {
        headers: { token: TOKEN },
      }
    );
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteMenu = async (id) => {
  try {
    return await axios.delete(`${BASE_URL}/foods/${id}`, {
      headers: { token: TOKEN },
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const getCategories = async () => {
  try {
    return await axios.get(`${BASE_URL}/menus`, {
      headers: { token: TOKEN },
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const getCategory = async (id) => {
  try {
    return await axios.get(`${BASE_URL}/menus/${id}`, {
      headers: { token: TOKEN },
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const getTables = async () => {
  try {
    return await axios.get(`${BASE_URL}/tables`, {
      headers: { token: TOKEN },
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const getTable = async (id) => {
  try {
    return await axios.get(`${BASE_URL}/tables/${id}`, {
      headers: { token: TOKEN },
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const patchTable = async (id, data) => {
  try {
    return await axios.patch(
      `${BASE_URL}/tables/${id}`,
      { ...data },
      {
        headers: { token: TOKEN },
      }
    );
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteTable = async (id) => {
  try {
    return await axios.delete(`${BASE_URL}/tables/${id}`, {
      headers: { token: TOKEN },
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const getOrders = async () => {
  try {
    return await axios.get(`${BASE_URL}/orders`, {
      headers: { token: TOKEN },
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteOrder = async (id) => {
  try {
    return await axios.delete(`${BASE_URL}/orders/${id}`, {
      headers: { token: TOKEN },
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const getInvoices = async () => {
  try {
    return await axios.get(`${BASE_URL}/invoices`, {
      headers: { token: TOKEN },
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const patchInvoice = async (id, data) => {
  try {
    return await axios.patch(
      `${BASE_URL}/invoices/${id}`,
      { ...data },
      {
        headers: { token: TOKEN },
      }
    );
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteInvoice = async (id) => {
  try {
    return await axios.delete(`${BASE_URL}/invoices/${id}`, {
      headers: { token: TOKEN },
    });
  } catch (error) {
    console.error(error.message);
  }
};
