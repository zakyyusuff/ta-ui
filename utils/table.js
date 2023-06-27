import { postWithToken } from "https://jscroot.github.io/api/croot.js";
import { getTables, patchTable, deleteTable } from "./callApi.js";

const btnLogoutNav = document.getElementById("btnLogoutNav");
const btnLogoutSide = document.getElementById("btnLogoutSide");
const containerTable = document.getElementById("container-table");
const createModal = document.getElementById("createModal");
const createForm = document.getElementById("createForm");
const createNumber = document.getElementById("createNumber");
const createCapacity = document.getElementById("createCapacity");
const createAlert = document.getElementById("createAlert");
const createClose = document.getElementById("createClose");
const createSubmit = document.getElementById("createSubmit");
const viewModal = document.getElementById("viewModal");
const viewForm = document.getElementById("viewForm");
const viewNumber = document.getElementById("viewNumber");
const viewCapacity = document.getElementById("viewCapacity");
const viewCreated = document.getElementById("viewCreated");
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const editId = document.getElementById("editId");
const editNumber = document.getElementById("editNumber");
const editCapacity = document.getElementById("editCapacity");
const editAlert = document.getElementById("editAlert");
const editClose = document.getElementById("editClose");
const editSubmit = document.getElementById("editSubmit");

function createTable(items, createRow) {
  const container = document.createElement("div");
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");
  const thead = `
    <thead>
      <tr>
        <th></th>
        <th>Table Number</th>
        <th>Capacity</th>
        <th>View</th>
        <th>Action</th>
      </tr>
    </thead>
  `;

  items.forEach((item, index) => {
    tbody.append(createRow(item, index));
  });

  container.classList.add("overflow-auto", "w-3/4", "mx-auto", "p-5");
  table.classList.add("bg-white", "shadow", "shadow-lg", "table");

  table.innerHTML = thead;
  table.append(tbody);
  container.append(table);
  return container;
}

function createRow(item, index = 0) {
  const tr = document.createElement("tr");
  const tdNo = document.createElement("td");
  const tdNumber = document.createElement("td");
  const tdCapacity = document.createElement("td");
  const tdView = document.createElement("td");
  const tdAction = document.createElement("td");

  const createView = (item) => {
    const container = document.createElement("div");
    const button = document.createElement("button");
    const i = document.createElement("i");

    container.classList.add("tooltip", "tooltip-bottom", "tooltip-info");
    container.setAttribute("data-tip", "view");
    button.classList.add("btn", "btn-square", "btn-outline", "pb-1", "btn-xs");
    i.classList.add("bi", "bi-eye");

    button.addEventListener("click", async (e) => {
      e.preventDefault();
      viewNumber.value = `Number ${item.table_number}`;
      viewCapacity.value = `${item.number_of_guests} Person`;
      viewCreated.value = new Date(item.created_at).toLocaleDateString(
        "id-ID",
        { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      );

      viewModal.showModal();
    });

    button.append(i);
    container.append(button);
    return container;
  };

  const createAction = (item) => {
    const container = document.createElement("div");
    const btnEdit = document.createElement("button");
    const btnDelete = document.createElement("button");

    container.classList.add("flex", "gap-5");
    btnEdit.classList.add("btn", "btn-xs", "btn-info");
    btnDelete.classList.add("btn", "btn-xs", "btn-error");
    btnEdit.innerText = "Edit";
    btnDelete.innerText = "Delete";

    // Edit Function
    btnEdit.addEventListener("click", async (e) => {
      e.preventDefault();
      editId.value = item._id;
      editNumber.value = item.table_number;
      editCapacity.value = item.number_of_guests;
      editModal.showModal();
    });

    // Delete Function
    btnDelete.addEventListener("click", async (e) => {
      e.preventDefault();
      console.log(item._id);
      const res = await deleteTable(item._id);
      if (await res) window.location.reload();
    });

    container.append(btnEdit, btnDelete);
    return container;
  };

  // Set Class and Text to created element
  tr.classList.add("hover");
  tdNumber.classList.add("font-bold");
  tdCapacity.classList.add("font-bold");
  tdNo.innerText = index + 1;
  tdNumber.innerText = `Number ${item.table_number}`;
  tdCapacity.innerText = `${item.number_of_guests} Person`;

  tdView.append(createView(item));
  tdAction.append(createAction(item));
  tr.append(tdNo, tdNumber, tdCapacity, tdView, tdAction);
  return tr;
}

(async function setup() {
  const { data: tables } = await getTables();

  if (tables != undefined || typeof tables == "array") {
    containerTable.replaceWith(createTable(tables, createRow));
  } else {
    containerTable.innerHTML = `
      <div class="w-3/4 mx-auto p-5 h-75 bg-zinc-200 rounded-lg" style="height: 50vh;">
        <h1 class="text-2xl text-center mt-28">Table is empty</h1>
      </div>
    `;
  }
})();

btnLogoutNav.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.reload();
});

btnLogoutSide.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.reload();
});

createSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const BASE_URL = "https://golang-restoran-i2-app.herokuapp.com";
  const TOKEN = localStorage.getItem("token");
  const data = {
    Table_number: parseInt(createNumber.value),
    Number_of_guests: parseInt(createCapacity.value),
  };

  postWithToken(`${BASE_URL}/tables`, "token", TOKEN, data, (res) => {
    if (res.error) {
      createAlert.style.display = "block";
    } else {
      createForm.reset();
      createModal.close();
      window.location.reload();
    }
  });
});

createClose.addEventListener("click", (e) => {
  e.preventDefault();
  createAlert.style.display = "none";
  createForm.reset();
  createModal.close();
});

editSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  const id = editId.value;
  const data = {
    Table_number: parseInt(editNumber.value),
    Number_of_guests: parseInt(editCapacity.value),
  };

  const res = await patchTable(id, data);
  if (await res) {
    editForm.reset();
    editModal.close();
    window.location.reload();
  } else {
    editAlert.style.display = "block";
  }
});

editClose.addEventListener("click", (e) => {
  e.preventDefault();
  editAlert.style.display = "none";
  editForm.reset();
  editModal.close();
});
