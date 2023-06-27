import { postWithToken } from "https://jscroot.github.io/api/croot.js";
import { getInvoices, patchInvoice, deleteInvoice } from "./callApi.js";

const btnLogoutNav = document.getElementById("btnLogoutNav");
const btnLogoutSide = document.getElementById("btnLogoutSide");
const containerTable = document.getElementById("container-table");
const viewModal = document.getElementById("viewModal");
const viewForm = document.getElementById("viewForm");
const viewInvoiceID = document.getElementById("viewInvoiceID");
const viewOrderID = document.getElementById("viewOrderID");
const viewMethod = document.getElementById("viewMethod");
const viewStatus = document.getElementById("viewStatus");
const viewTime = document.getElementById("viewTime");
const viewDate = document.getElementById("viewDate");
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const editId = document.getElementById("editId");
const editInvoiceId = document.getElementById("editInvoiceId");
const editMethod = document.getElementById("editMethod");
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
        <th>Invoice ID</th>
        <th>Order ID</th>
        <th>Status</th>
        <th>View</th>
        <th>Action</th>
      </tr>
    </thead>
  `;

  items.forEach((item, index) => {
    tbody.append(createRow(item, index));
  });

  container.classList.add("overflow-auto", "w-3/4", "mx-auto", "p-5");
  table.classList.add(
    "bg-white",
    "shadow",
    "shadow-lg",
    "table",
    "text-center"
  );

  table.innerHTML = thead;
  table.append(tbody);
  container.append(table);
  return container;
}

function createRow(item, index = 0) {
  const tr = document.createElement("tr");
  const tdNo = document.createElement("td");
  const tdInvoiceID = document.createElement("td");
  const tdOrderID = document.createElement("td");
  const tdStatus = document.createElement("td");
  const tdView = document.createElement("td");
  const tdAction = document.createElement("td");

  const createView = (item) => {
    const date = new Date(item.payment_due_date);
    const container = document.createElement("div");
    const button = document.createElement("button");
    const i = document.createElement("i");

    container.classList.add("tooltip", "tooltip-bottom", "tooltip-info");
    container.setAttribute("data-tip", "view");
    button.classList.add("btn", "btn-square", "btn-outline", "pb-1", "btn-xs");
    i.classList.add("bi", "bi-eye");

    button.addEventListener("click", async (e) => {
      e.preventDefault();

      viewInvoiceID.value = item._id;
      viewOrderID.value = item.order_id;
      viewMethod.value = item.payment_method || "-";
      viewStatus.value = item.payment_status;
      viewTime.value = `At ${date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
      viewDate.value = date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

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

    container.classList.add("flex", "gap-5", "justify-center", "items-center");
    btnEdit.classList.add("btn", "btn-xs", "btn-info");
    btnDelete.classList.add("btn", "btn-xs", "btn-error");
    btnEdit.innerText = "PAY";
    btnDelete.innerText = "Delete";

    // Edit Function
    btnEdit.addEventListener("click", async (e) => {
      e.preventDefault();
      editId.value = item._id;
      editInvoiceId.value = item._id;

      editModal.showModal();
    });

    // Delete Function
    btnDelete.addEventListener("click", async (e) => {
      e.preventDefault();
      const res = await deleteInvoice(item._id);
      if (res) window.location.reload();
    });

    if (item.payment_status === "PAID") {
      container.append(btnDelete);
    } else {
      container.append(btnEdit, btnDelete);
    }

    return container;
  };

  const createBadge = (item) => {
    const container = document.createElement("div");

    container.classList.add("badge", "text-xs");
    item.payment_status === "PAID"
      ? container.classList.add("badge-success")
      : container.classList.add("badge-warning");
    container.innerText = item.payment_status;

    return container;
  };

  // Set Class and Text to created element
  tr.classList.add("hover");
  tdNo.innerText = index + 1;
  tdInvoiceID.innerText = item.invoice_id;
  tdOrderID.innerText = item.order_id;

  tdStatus.append(createBadge(item));
  tdView.append(createView(item));
  tdAction.append(createAction(item));
  tr.append(tdNo, tdInvoiceID, tdOrderID, tdStatus, tdView, tdAction);
  return tr;
}

(async function setup() {
  const { data: invoices } = await getInvoices();

  console.log(invoices);

  if (invoices != undefined || typeof invoices == "array") {
    containerTable.replaceWith(createTable(invoices, createRow));
  } else {
    containerTable.innerHTML = `
      <div class="w-3/4 mx-auto p-5 h-75 bg-zinc-200 rounded-lg" style="height: 50vh;">
        <h1 class="text-2xl text-center mt-28">Invoice is empty</h1>
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

editSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(editForm));

  if (!data.payment_method) {
    editAlert.style.display = "block";
  } else {
    const res = await patchInvoice(data.id, {
      ...data,
      payment_status: "PAID",
    });

    if (res) {
      editModal.close();
      editForm.reset();
      window.location.reload();
    }
  }
});

editClose.addEventListener("click", (e) => {
  e.preventDefault();
  editModal.close();
  editForm.reset();
  editAlert.style.display = "none";
});
