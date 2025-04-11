/**
 * Crear
 */
document
  .getElementById("registerUser")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const personId = document.getElementById("personId").value;

    const data = {
      username: name,
      password: password,
      personId: personId,
    };

    try {
      const response = await fetch("https://localhost:7258/api/User/Create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        ListaUsuarios();
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
document.addEventListener("DOMContentLoaded", ListaUsuarios(), cargarSelects());

function ListaUsuarios() {
  fetch("https://localhost:7258/api/User/GetAll")
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      const tbody = document.querySelector("#tablaUser tbody");
      tbody.innerHTML = "";

      data.forEach((User) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
                    <td>${User.id}</td>
                    <td>${User.username}</td>
                    <td>${User.password}</td>
                    <td>${User.personName}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="Modificar(${User.id}, '${User.username}', '${User.password}')">Actualizar</button>
                        <select id="strategy-${User.id}" class="form-select form-select-sm" style="width: auto; display: inline-block;">
                            <option value="Logical">Lógico</option>
                            <option value="Permanent">Persistente</option>
                        </select>
                        <button class="btn btn-sm btn-danger" onclick="Eliminar(${User.id})">Eliminar</button>
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

async function Modificar(id, username, password) {
  document.getElementById("UserId").value = id;

  await cargarSelects("personIdUpdate");

  document.getElementById("usernameUpdate").value = username;
  document.getElementById("passwordUpdate").value = password;

  const modal = new bootstrap.Modal(document.getElementById("Actualizar"));
  modal.show();
}

document
  .getElementById("ActualizarUser")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      id: parseInt(document.getElementById("UserId").value),
      username: document.getElementById("usernameUpdate").value,
      password: document.getElementById("passwordUpdate").value,
      personId: document.getElementById("personIdUpdate").value,
    };

    fetch("https://localhost:7258/api/User/Update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((resp) => {
      console.log(data);
      if (resp.ok) {
        bootstrap.Modal.getInstance(
          document.getElementById("Actualizar")
        ).hide();
        ListaUsuarios();
        alert("Usuario actualizado");
      } else {
        alert("Error al actualizar el Usuario");
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
  if (confirm("¿Estás seguro de que deseas eliminar este Usuario?")) {
    fetch(`https://localhost:7258/api/User/Delete/${id}?strategy=${strategy}`, {
      method: "DELETE",
    })
      .then((resp) => {
        if (resp.ok) {
          alert("Usuario eliminado");
          ListaUsuarios();
        } else {
          alert("Error al eliminar el Usuario");
        }
      })
      .catch((error) => {
        console.error("Error en la petición DELETE:", error);
        alert("Error de conexión al intentar eliminar");
      });
  }
}

/**
 * Seleects
 */
async function cargarSelects(personSelectId = "personId") {
  const personSelect = document.getElementById(personSelectId);


  // Cargar persones
  const personResponse = await fetch("https://localhost:7258/api/Person/GetAll");
  const persons = await personResponse.json();
  personSelect.innerHTML = "";
  persons.forEach((person) => {
    const option = document.createElement("option");
    option.value = person.id;
    option.textContent = person.name;
    personSelect.appendChild(option);
  });
}
