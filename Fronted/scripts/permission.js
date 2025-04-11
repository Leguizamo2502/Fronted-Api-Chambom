/**
 * Crear
 */
document
  .getElementById("registerPermission")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;

    const data = {
      name: name,
      description: description,
    };

    try {
      const response = await fetch("https://localhost:7258/api/Permission/Create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        ListaPermisos();
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
document.addEventListener("DOMContentLoaded", ListaPermisos);

function ListaPermisos(){
    fetch("https://localhost:7258/api/Permission/GetAll")
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      const tbody = document.querySelector("#tablaPermission tbody");
      tbody.innerHTML = "";

      count = 1; // contador

      data.forEach((permission) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
                    <td>${count++}</td>
                    <td>${permission.name}</td>
                    <td>${permission.description}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="Modificar(${permission.id}, '${permission.name}', '${permission.description}')">Actualizar</button>
                        <select id="strategy-${permission.id}" class="form-select form-select-sm" style="width: auto; display: inline-block;">
                            <option value="Logical">Lógico</option>
                            <option value="Permanent">Persistente</option>
                        </select>
                        <button class="btn btn-sm btn-danger" onclick="Eliminar(${permission.id})">Eliminar</button>
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
  document.getElementById("permissionId").value = id;
  document.getElementById("nameUpdate").value = name;
  document.getElementById("descriptionUpdate").value = description;

  const modal = new bootstrap.Modal(document.getElementById("Actualizar"));
  modal.show();
}

document
  .getElementById("formActualizarPermission")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      id: parseInt(document.getElementById("permissionId").value),
      name: document.getElementById("nameUpdate").value,
      description: document.getElementById("descriptionUpdate").value,
    };

    fetch("https://localhost:7258/api/Permission/Update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((resp) => {
       // console.log(data)
      if (resp.ok) {
        bootstrap.Modal.getInstance(
          document.getElementById("Actualizar")
        ).hide();
        ListaPermisos()
        alert("Permiso actualizado");
      } else {
        alert("Error al actualizar el permiso");
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
    if (confirm("¿Estás seguro de que deseas eliminar este Permiso?")) {
        fetch(`https://localhost:7258/api/Permission/Delete/${id}?strategy=${strategy}`, {
          method: "DELETE"
        })
          .then((resp) => {
            if (resp.ok) {
              alert("Permiso eliminado");
              ListaPermisos(); 
            } else {
              alert("Error al eliminar el permiso");
            }
          })
          .catch((error) => {
            console.error("Error en la petición DELETE:", error);
            alert("Error de conexión al intentar eliminar");
          });
      }
}