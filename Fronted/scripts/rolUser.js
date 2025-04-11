/**
 * Crear
 */
document
  .getElementById("registerRolUser")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const rolId = document.getElementById("rolId").value;
    const userId = document.getElementById("userId").value;

    const data = {
      rolId: rolId,
      userId: userId,
    };
    //console.log(data);

    try {
      const response = await fetch(
        "https://localhost:7258/api/RolUser/Create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        ListaRolUsers();
        alert("Registro exitoso");
      } else {
        alert("Error en el registro");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en el registro");
    }
  });
/**
 *
 * Listar
 *
 */
document.addEventListener("DOMContentLoaded", ListaRolUsers(), cargarSelects());

function ListaRolUsers() {
  fetch("https://localhost:7258/api/RolUser/GetAll")
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      const tbody = document.querySelector("#tablaRolUser tbody");
      tbody.innerHTML = "";

      data.forEach((RolUser) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
                    <td>${RolUser.id}</td>
                    <td>${RolUser.rolId}</td>
                    <td>${RolUser.userId}</td>
                    <td>${RolUser.rolName}</td>
                    <td>${RolUser.userName}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="Modificar(${RolUser.id}, '${RolUser.rolId}', '${RolUser.userId}')">Actualizar</button>
                        <select id="strategy-${RolUser.id}" class="form-select form-select-sm" style="width: auto; display: inline-block;">
                            <option value="Logical">Lógico</option>
                            <option value="Permanent">Persistente</option>
                        </select>
                        <button class="btn btn-sm btn-danger" onclick="Eliminar(${RolUser.id})">Eliminar</button>
                    </td>
                `;
        tbody.appendChild(fila);
      });
    });
}

/**
 *
 * Actualizar
 *
 */

async function Modificar(id, rolId, userId) {
  document.getElementById("RolUserId").value = id;
  // Cargar selects del modal
  await cargarSelects("rolIdUpdate", "userIdUpdate");

  document.getElementById("rolIdUpdate").value = rolId;
  document.getElementById("userIdUpdate").value = userId;

  const modal = new bootstrap.Modal(document.getElementById("Actualizar"));
  modal.show();
}

document
  .getElementById("ActualizarRolUser")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      id: parseInt(document.getElementById("RolUserId").value),
      rolId: document.getElementById("rolIdUpdate").value,
      userId: document.getElementById("userIdUpdate").value,
    };

    fetch("https://localhost:7258/api/RolUser/Update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((resp) => {
      // console.log(data)
      if (resp.ok) {
        bootstrap.Modal.getInstance(
          document.getElementById("Actualizar")
        ).hide();
        ListaRolUsers();
        alert("RolUser actualizado");
      } else {
        alert("Error al actualizar el RolUser");
      }
    });
  });

/**
 *
 * Eliminar
 *
 */

function Eliminar(id) {
  const strategy = document.getElementById(`strategy-${id}`).value;
  if (confirm("¿Estás seguro de que deseas eliminar este RolUser?")) {
    fetch(
      `https://localhost:7258/api/RolUser/Delete/${id}?strategy=${strategy}`,
      {
        method: "DELETE",
      }
    )
      .then((resp) => {
        if (resp.ok) {
          alert("RolUser eliminado");
          ListaRolUsers();
        } else {
          alert("Error al eliminar el RolUser");
        }
      })
      .catch((error) => {
        console.error("Error en la petición DELETE:", error);
        alert("Error de conexión al intentar eliminar");
      });
  }
}

/**
 * Selects
 */

async function cargarSelects(rolSelectId = "rolId", userSelectId = "userId") {
  const rolSelect = document.getElementById(rolSelectId);
  const userSelect = document.getElementById(userSelectId);

  // Cargar roles
  const rolResponse = await fetch("https://localhost:7258/api/Rol/GetAll");
  const rols = await rolResponse.json();
  rolSelect.innerHTML = "";
  rols.forEach((rol) => {
    const option = document.createElement("option");
    option.value = rol.id;
    option.textContent = rol.name;
    rolSelect.appendChild(option);
  });

  // Cargar usuerios
  const userResponse = await fetch("https://localhost:7258/api/User/GetAll");
  const users = await userResponse.json();
  userSelect.innerHTML = "";
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.username;
    userSelect.appendChild(option);
  });
}
