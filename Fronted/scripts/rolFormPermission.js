/**
 * Crear
 */
document
  .getElementById("registerRolFormPermission")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const rolId = document.getElementById("rolId").value;
    const formId = document.getElementById("formId").value;
    const permissionId = document.getElementById("permissionId").value;

    const data = {
      rolId: rolId,
      formId: formId,
      permissionId: permissionId,
    };
    // console.log(data);

    try {
      const response = await fetch(
        "https://localhost:7258/api/RolFormPermission/Create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        ListaRolFormPermissions();
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
document.addEventListener(
  "DOMContentLoaded",
  ListaRolFormPermissions(),
  cargarSelects()
);

function ListaRolFormPermissions() {
  fetch("https://localhost:7258/api/RolFormPermission/GetAll")
    .then((response) => response.json())
    .then((data) => {
    //   console.log(data);
      const tbody = document.querySelector("#tablaRolFormPermission tbody");
      tbody.innerHTML = "";

      

      data.forEach((RolFormPermission) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
                    <td>${RolFormPermission.id}</td>
                    <td>${RolFormPermission.rolId}</td>
                    <td>${RolFormPermission.formId}</td>
                    <td>${RolFormPermission.permissionId}</td>
                    <td>${RolFormPermission.rolName}</td>
                    <td>${RolFormPermission.formName}</td>
                    <td>${RolFormPermission.permissionName}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="Modificar(${RolFormPermission.id}, '${RolFormPermission.rolId}','${RolFormPermission.formId}', '${RolFormPermission.permissionId}')">Actualizar</button>
                        <select id="strategy-${RolFormPermission.id}" class="form-select form-select-sm" style="width: auto; display: inline-block;">
                            <option value="Logical">Lógico</option>
                            <option value="Permanent">Persistente</option>
                        </select>
                        <button class="btn btn-sm btn-danger" onclick="Eliminar(${RolFormPermission.id})">Eliminar</button>
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

async function Modificar(id, rolId, formId, permissionId) {
  document.getElementById("RolFormPermissionId").value = id;

  // Cargar selects del modal
  await cargarSelects("rolIdUpdate","formIdUpdate", "permissionIdUpdate");

  // Establecer valores seleccionados
  document.getElementById("rolIdUpdate").value = rolId;
  document.getElementById("formIdUpdate").value = formId;
  document.getElementById("permissionIdUpdate").value = permissionId;

  const modal = new bootstrap.Modal(document.getElementById("Actualizar"));
  modal.show();
}

document
  .getElementById("ActualizarRolFormPermission")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      id: parseInt(document.getElementById("RolFormPermissionId").value),
      rolId: document.getElementById("rolIdUpdate").value,
      formId: document.getElementById("formIdUpdate").value,
      permissionId: document.getElementById("permissionIdUpdate").value,
    };
    console.log(data);

    fetch("https://localhost:7258/api/RolFormPermission/Update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((resp) => {
      // console.log(data)
      if (resp.ok) {
        bootstrap.Modal.getInstance(
          document.getElementById("Actualizar")
        ).hide();
        ListaRolFormPermissions();
        alert("RolFormPermission actualizado");
      } else {
        alert("Error al actualizar el RolFormPermission");
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
  if (confirm("¿Estás seguro de que deseas eliminar este RolFormPermission?")) {
    fetch(
      `https://localhost:7258/api/RolFormPermission/Delete/${id}?strategy=${strategy}`,
      {
        method: "DELETE",
      }
    )
      .then((resp) => {
        if (resp.ok) {
          alert("RolFormPermission eliminado");
          ListaRolFormPermissions();
        } else {
          alert("Error al eliminar el RolFormPermission");
        }
      })
      .catch((error) => {
        console.error("Error en la petición DELETE:", error);
        alert("Error de conexión al intentar eliminar");
      });
  }
}

/**
 * Obtener
 */

async function cargarSelects(
  rolSelectId = "rolId",
  formSelectId = "formId",
  permissionSelectId = "permissionId"
) {
  const rolSelect = document.getElementById(rolSelectId);
  const formSelect = document.getElementById(formSelectId);
  const permissionSelect = document.getElementById(permissionSelectId);

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

  // Cargar formularios
  const formResponse = await fetch("https://localhost:7258/api/Form/GetAll");
  const forms = await formResponse.json();
  formSelect.innerHTML = "";
  forms.forEach((form) => {
    const option = document.createElement("option");
    option.value = form.id;
    option.textContent = form.name;
    formSelect.appendChild(option);
  });

  // Cargar módulos
  const permissionResponse = await fetch(
    "https://localhost:7258/api/Permission/GetAll"
  );
  const permissions = await permissionResponse.json();
  permissionSelect.innerHTML = "";
  permissions.forEach((permission) => {
    const option = document.createElement("option");
    option.value = permission.id;
    option.textContent = permission.name;
    permissionSelect.appendChild(option);
  });
}
