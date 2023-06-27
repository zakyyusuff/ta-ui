import { postWithToken } from "https://jscroot.github.io/api/croot.js";
import {
  getOrders,
  deleteOrder,
  getTable,
  getTables,
  getMenus,
} from "./callApi.js";

const btnLogoutNav = document.getElementById("btnLogoutNav");
const btnLogoutSide = document.getElementById("btnLogoutSide");
const containerTable = document.getElementById("container-table");
const createForm = document.getElementById("createForm");
const createTableOption = document.getElementById("createTable");
const createListItem = document.getElementById("createlistItem");
const createAlert = document.getElementById("createAlert");
const createClose = document.getElementById("createClose");
const createSubmit = document.getElementById("createSubmit");
const addItemModal = document.getElementById("addItemModal");
const addItemForm = document.getElementById("addItemForm");
const addItemOption = document.getElementById("addItemOption");
const addItemQuantity = document.getElementById("addItemQuantity");
const addItemAlert = document.getElementById("addItemAlert");
const addItemClose = document.getElementById("addItemClose");
const addItemSubmit = document.getElementById("addItemSubmit");
const viewModal = document.getElementById("viewModal");
const viewForm = document.getElementById("viewForm");
const viewOrder = document.getElementById("viewOrder");
const viewNumber = document.getElementById("viewNumber");
const viewTime = document.getElementById("viewTime");
const viewDate = document.getElementById("viewDate");

const BASE_URL = "https://golang-restoran-i2-app.herokuapp.com";
const TOKEN = localStorage.getItem("token");
const ORDER_ITEMS = JSON.parse(localStorage.getItem("Order_items")) || [];

function createTable(items, createRow) {
  const container = document.createElement("div");
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");
  const thead = `
    <thead>
      <tr>
        <th></th>
        <th>Order ID</th>
        <th>Order Date</th>
        <th>View</th>
        <th>Action</th>
      </tr>
    </thead>
  `;

  items.forEach((item, index) => {
    tbody.append(createRow(item, index));
  });

  container.classList.add("overflow-auto", "w-full", "mx-auto", "px-4", "py-5");
  table.classList.add("bg-white", "shadow", "shadow-lg", "table");

  table.innerHTML = thead;
  table.append(tbody);
  container.append(table);
  return container;
}

function createRow(item, index = 0) {
  const tr = document.createElement("tr");
  const tdNo = document.createElement("td");
  const tdOrderID = document.createElement("td");
  const tdOrderDate = document.createElement("td");
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
      const res = await getTable(item.table_id);
      viewOrder.value = item.order_id;
      viewNumber.value = !!res
        ? `Number ${res.data.table_number}`
        : item.table_id;
      viewTime.value = `At ${new Date(item.order_date).toLocaleTimeString(
        "id-ID",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}`;
      viewDate.value = new Date(item.order_date).toLocaleDateString("id-ID", {
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
    const btnDelete = document.createElement("button");

    container.classList.add("flex", "gap-5");
    btnDelete.classList.add("btn", "btn-xs", "btn-error");
    btnDelete.innerText = "Delete";

    // Delete Function
    btnDelete.addEventListener("click", async (e) => {
      e.preventDefault();
      const res = await deleteOrder(item._id);
      if (await res) window.location.reload();
    });

    container.append(btnDelete);
    return container;
  };

  // Set Class and Text to created element
  tr.classList.add("hover");
  tdNo.innerText = index + 1;
  tdOrderID.innerText = item.order_id;
  tdOrderDate.innerText = new Date(item.created_at).toLocaleDateString(
    "id-ID",
    { year: "numeric", month: "long", day: "numeric" }
  );

  tdView.append(createView(item));
  tdAction.append(createAction(item));
  tr.append(tdNo, tdOrderID, tdOrderDate, tdView, tdAction);
  return tr;
}

function createItemElement(item) {
  return `
    <div class="flex py-2">
      <div class="basis-9/12">
        ${item.name}
        </div>
      <div class="basis-3/12 text-center border-s-2 border-dashed">
        ${item.Quantity}
      </div>
    </div>
  `;
}

function createListElement(items, createItemElement) {
  let lists = "";
  items.forEach((item) => {
    lists += createItemElement(item);
  });
  return lists;
}

(async function setup() {
  const { data: orders } = await getOrders();
  const { data: tables } = await getTables();
  const res = await getMenus();

  if (ORDER_ITEMS !== null) {
    createListItem.innerHTML = createListElement(
      ORDER_ITEMS,
      createItemElement
    );
  }

  if (orders != undefined || typeof orders == "array") {
    containerTable.replaceWith(createTable(orders, createRow));
  } else {
    containerTable.innerHTML = `
      <div class="overflow-auto w-full mx-auto px-4">
        <div class="my-5  pt-24 pb-28 bg-zinc-200 rounded-xl">
          <h1 class="text-2xl text-center">Table is empty</h1>
        </div>
      </div>
    `;
  }

  if (tables != undefined || typeof tables == "array") {
    tables.forEach((i) => {
      createTableOption.options.add(
        new Option(`Number ${i.table_number}`, i.table_id)
      );
    });
  }

  if (res != undefined || typeof tables == "array") {
    const menus = res.data.food_items;
    menus.forEach((i) => {
      addItemOption.options.add(new Option(i.name, i.food_id));
    });
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
  createAlert.style.display = "none";
  const data = {
    ...Object.fromEntries(new FormData(createForm)),
    Order_items: ORDER_ITEMS,
    Order_date: new Date(),
  };

  postWithToken(`${BASE_URL}/orders`, "token", TOKEN, data, (res) => {
    if (res.error) {
      createAlert.style.display = "block";
    } else {
      postWithToken(
        `${BASE_URL}/invoices`,
        "token",
        TOKEN,
        {
          Payment_method: "",
          Order_id: res.InsertedID,
        },
        (res) => {
          console.log(res);
          if (res.error) {
            console.error("error create invoices");
            createAlert.style.display = "block";
          } else {
            console.log("success create invoices");
            localStorage.removeItem("Order_items");
            createListItem.innerHTML = "";
            createForm.reset();
            window.location.reload();
          }
        }
      );
    }
  });
});

createClose.addEventListener("click", (e) => {
  e.preventDefault();
  ORDER_ITEMS.length = 0;
  localStorage.removeItem("Order_items");
  createListItem.innerHTML = "";
  createForm.reset();
});

addItemSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const data = {
    Food_id: addItemOption.value,
    name: addItemOption.options[addItemOption.selectedIndex].text,
    Quantity: addItemQuantity.value,
  };

  if (data.Food_id && data.Quantity) {
    if (ORDER_ITEMS === null || ORDER_ITEMS === undefined) {
      localStorage.setItem("Order_items", JSON.stringify([data]));
    } else {
      ORDER_ITEMS.push(data);
      localStorage.setItem("Order_items", JSON.stringify(ORDER_ITEMS));
    }

    createListItem.innerHTML = createListElement(
      ORDER_ITEMS,
      createItemElement
    );

    addItemModal.close();
    addItemForm.reset();
    addItemAlert.style.display = "none";
  } else {
    addItemAlert.style.display = "block";
  }
});

addItemClose.addEventListener("click", (e) => {
  e.preventDefault();
  addItemModal.close();
  addItemForm.reset();
  addItemAlert.style.display = "none";
});
