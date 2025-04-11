/**
 * Crear
 */
document
  .getElementById("registerRol")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;

    const data = {
      name: name,
      description: description,
    };

    try {
      const response = await fetch("https://localhost:7258/api/Rol/Create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        listaRoles();
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
document.addEventListener("DOMContentLoaded", listaRoles);

function listaRoles(){
    fetch("https://localhost:7258/api/Rol/GetAll")
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      const tbody = document.querySelector("#tablaRoles tbody");
      tbody.innerHTML = "";

      let count = 1; // contador

      data.forEach((rol) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
                    <td>${count++}</td>
                    <td>${rol.name}</td>
                    <td>${rol.description}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="Modificar(${rol.id}, '${rol.name}', '${rol.description}')">Actualizar</button>
                        <select id="strategy-${rol.id}" class="form-select form-select-sm" style="width: auto; display: inline-block;">
                            <option value="Logical">Lógico</option>
                            <option value="Permanent">Persistente</option>
                        </select>
                        <button class="btn btn-sm btn-danger" onclick="Eliminar(${rol.id})">Eliminar</button>
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

function Modificar(id, name, description) {
  document.getElementById("rolId").value = id;
  document.getElementById("nameUpdate").value = name;
  document.getElementById("descriptionUpdate").value = description;

  const modal = new bootstrap.Modal(document.getElementById("Actualizar"));
  modal.show();
}

document
  .getElementById("formActualizarRol")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      id: parseInt(document.getElementById("rolId").value),
      name: document.getElementById("nameUpdate").value,
      description: document.getElementById("descriptionUpdate").value,
    };

    fetch("https://localhost:7258/api/Rol/Update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((resp) => {
      if (resp.ok) {
        bootstrap.Modal.getInstance(
          document.getElementById("Actualizar")
        ).hide();
        listaRoles()
        alert("Rol actualizado");
      } else {
        alert("Error al actualizar el rol");
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
    if (confirm("¿Estás seguro de que deseas eliminar este rol?")) {
        fetch(`https://localhost:7258/api/Rol/Delete/${id}?strategy=${strategy}`, {
          method: "DELETE"
        })
          .then((resp) => {
            if (resp.ok) {
              alert("Rol eliminado");
              listaRoles(); 
            } else {
              alert("Error al eliminar el rol");
            }
          })
          .catch((error) => {
            console.error("Error en la petición DELETE:", error);
            alert("Error de conexión al intentar eliminar");
          });
      }
}