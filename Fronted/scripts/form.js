/**
 * Crear
 */
document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;

    const data = {
      name: name,
      description: description,
    };

    try {
      const response = await fetch("https://localhost:7258/api/Form/Create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        ListaFomularios();
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
document.addEventListener("DOMContentLoaded", ListaFomularios);

function ListaFomularios(){
    fetch("https://localhost:7258/api/Form/GetAll")
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      const tbody = document.querySelector("#tablaForm tbody");
      tbody.innerHTML = "";
      count = 1; // contador
      data.forEach((Form) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
                    <td>${count++}</td>
                    <td>${Form.name}</td>
                    <td>${Form.description}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="Modificar(${Form.id}, '${Form.name}', '${Form.description}')">Actualizar</button>
                        <select id="strategy-${Form.id}" class="form-select form-select-sm" style="width: auto; display: inline-block;">
                            <option value="Logical">Lógico</option>
                            <option value="Permanent">Persistente</option>
                        </select>
                        <button class="btn btn-sm btn-danger" onclick="Eliminar(${Form.id})">Eliminar</button>
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
  document.getElementById("FormId").value = id;
  document.getElementById("nameUpdate").value = name;
  document.getElementById("descriptionUpdate").value = description;

  const modal = new bootstrap.Modal(document.getElementById("Actualizar"));
  modal.show();
}

document
  .getElementById("formActualizarForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      id: parseInt(document.getElementById("FormId").value),
      name: document.getElementById("nameUpdate").value,
      description: document.getElementById("descriptionUpdate").value,
    };

    fetch("https://localhost:7258/api/Form/Update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((resp) => {
       // console.log(data)
      if (resp.ok) {
        bootstrap.Modal.getInstance(
          document.getElementById("Actualizar")
        ).hide();
        ListaFomularios()
        alert("Fomulario actualizado");
      } else {
        alert("Error al actualizar el Fomulario");
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
    if (confirm("¿Estás seguro de que deseas eliminar este Fomulario?")) {
        fetch(`https://localhost:7258/api/Form/Delete/${id}?strategy=${strategy}`, {
          method: "DELETE"
        })
          .then((resp) => {
            if (resp.ok) {
              alert("Fomulario eliminado");
              ListaFomularios(); 
            } else {
              alert("Error al eliminar el Fomulario");
            }
          })
          .catch((error) => {
            console.error("Error en la petición DELETE:", error);
            alert("Error de conexión al intentar eliminar");
          });
      }
}