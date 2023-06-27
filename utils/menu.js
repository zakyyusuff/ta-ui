import { postWithToken } from "https://jscroot.github.io/api/croot.js";
import {
  getMenus,
  patchMenu,
  deleteMenu,
  getCategory,
  getCategories,
} from "./callApi.js";
const BASE_URL = "https://golang-restoran-i2-app.herokuapp.com";
const TOKEN = localStorage.getItem("token");

const containerTable = document.getElementById("container-table");
const btnLogoutNav = document.getElementById("btnLogoutNav");
const btnLogoutSide = document.getElementById("btnLogoutSide");

// Create New Menu
const modalCreate = document.getElementById("createMenuModal");
const formCreate = document.getElementById("createMenuForm");
const selectBoxCreate = document.getElementById("categoryOptions");
const closeModal = document.getElementById("closeModalMenu");
const submitModal = document.getElementById("submitModalMenu");
const alertCreate = document.getElementById("alertCreate");

// View Menu
const viewMenuModal = document.getElementById("viewMenuModal");
const viewMenuForm = document.getElementById("viewMenuForm");

// Edit Menu
const editMenuModal = document.getElementById("editMenuModal");
const editMenuForm = document.getElementById("editMenuForm");
const submitEditModal = document.getElementById("submitEditModalMenu");

function createTable(items, createRow) {
  const container = document.createElement("div");
  const table = document.createElement("table");
  const thead = `
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Price</th>
        <th>Image</th>
        <th>View</th>
        <th>Action</th>
      </tr>
    </thead>
  `;
  const tbody = document.createElement("tbody");

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
  const tdNumber = document.createElement("td");
  const tdName = document.createElement("td");
  const tdPrice = document.createElement("td");
  const tdImage = document.createElement("td");
  const tdView = document.createElement("td");
  const tdAction = document.createElement("td");

  const createImage = (item) => {
    const divOuter = document.createElement("div");
    const divInner = document.createElement("div");
    const img = document.createElement("img");
    const span = document.createElement("span");

    // Set Class and Text to created element
    divOuter.classList.add("avatar");
    divInner.classList.add(
      "w-12",
      "rounded-full",
      "bg-neutral-focus",
      "text-neutral-content"
    );
    span.classList.add("text-xl");
    span.innerText = item.name;
    img.src = item.food_image;
    img.alt = item.name;

    // Append element to parent
    divInner.append(img, span);
    divOuter.append(divInner);
    return divOuter;
  };

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
      const res = await getCategory(item.menu_id);
      const viewName = document.getElementById("viewName");
      const viewPrice = document.getElementById("viewPrice");
      const viewImage = document.getElementById("viewImage");
      const viewCategory = document.getElementById("viewCategory");
      const viewCreatedAt = document.getElementById("viewCreatedAt");

      viewName.value = item.name;
      viewPrice.value = item.price;
      viewImage.src = item.food_image;
      viewImage.alt = item.name;
      viewCategory.value = res.data.name;
      viewCreatedAt.value = new Date(item.created_at).toLocaleDateString(
        "id-ID",
        { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      );

      viewMenuModal.showModal();
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
      const { data: options } = await getCategories();
      const id = document.getElementById("idMenuEdit");
      const editName = document.getElementById("editName");
      const editPrice = document.getElementById("editPrice");
      const editImage = document.getElementById("editImage");
      const editCategory = document.getElementById("editCategory");

      editCategory.options.length = 0;
      options.forEach((i) => {
        const selected = item.menu_id == i._id ? true : false;
        editCategory.options.add(new Option(i.name, i.menu_id, selected));
      });

      id.value = item._id;
      editName.value = item.name;
      editPrice.value = item.price;
      editImage.value = item.food_image;
      editCategory.value = item.menu_id;

      editMenuModal.showModal();
    });

    // Delete Function
    btnDelete.addEventListener("click", async (e) => {
      e.preventDefault();
      console.log(item._id);
      const res = await deleteMenu(item._id);

      if (await res) window.location.reload();
    });

    container.append(btnEdit, btnDelete);
    return container;
  };

  // Set Class and Text to created element
  tr.classList.add("hover");
  tdNumber.innerText = index + 1;
  tdName.innerText = item.name;
  tdPrice.innerText = item.price;

  tdImage.append(createImage(item));
  tdView.append(createView(item));
  tdAction.append(createAction(item));
  tr.append(tdNumber, tdName, tdPrice, tdImage, tdView, tdAction);
  return tr;
}

(async function setup() {
  const { data: options } = await getCategories();
  getMenus().then((res) => {
    const menus = res?.data?.food_items;

    if (menus != undefined || typeof menus == "array") {
      containerTable.replaceWith(createTable(menus, createRow));
    } else {
      containerTable.innerHTML = `
        <div class="w-3/4 mx-auto p-5 h-75 bg-zinc-200 rounded-lg" style="height: 50vh;">
          <h1 class="text-2xl text-center mt-28">Menu is empty</h1>
        </div>
      `;
    }
  });

  options.forEach((i) => {
    selectBoxCreate.options.add(new Option(i.name, i.menu_id));
  });
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

submitModal.addEventListener("click", async (e) => {
  e.preventDefault();
  const Name = document.querySelector("input[name='Name']").value;
  const Price = document.querySelector("input[name='Price']").value;
  const Food_image = document.querySelector("input[name='Food_image']").value;
  const menu = {
    Name: Name,
    Price: parseInt(Price),
    Food_image: Food_image,
    Menu_id: selectBoxCreate.value,
  };

  postWithToken(`${BASE_URL}/foods`, "token", TOKEN, menu, (res) => {
    if (res.error) {
      alertCreate.style.display = "block";
    } else {
      modalCreate.close();
      formCreate.reset();
      window.location.reload();
    }
  });
});

submitEditModal.addEventListener("click", async (e) => {
  e.preventDefault();
  const id = document.getElementById("idMenuEdit").value;
  const Name = document.getElementById("editName").value;
  const Price = document.getElementById("editPrice").value;
  const Food_image = document.getElementById("editImage").value;
  const Menu_id = document.getElementById("editCategory").value;
  const menu = {
    name: Name,
    price: parseInt(Price),
    food_image: Food_image,
    menu_id: Menu_id,
  };

  const res = await patchMenu(id, menu);

  if (await res) {
    viewMenuModal.close();
    viewMenuForm.reset();
    window.location.reload();
  }
});

closeModal.addEventListener("click", () => {
  alertCreate.style.display = "none";
  modalCreate.close();
  formCreate.reset();
  editMenuForm.reset();
});
