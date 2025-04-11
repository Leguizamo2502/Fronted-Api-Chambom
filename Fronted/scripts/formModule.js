/**
 * Crear
 */
document
  .getElementById("registerFormModule")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formId = document.getElementById("formId").value;
    const moduleId = document.getElementById("moduleId").value;

    const data = {
      formId: formId,
      moduleId: moduleId,
    };
    //console.log(data);

    try {
      const response = await fetch("https://localhost:7258/api/FormModule/Create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        ListaFormModules();
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
document.addEventListener("DOMContentLoaded", ListaFormModules(),cargarSelects());

function ListaFormModules(){
    fetch("https://localhost:7258/api/FormModule/GetAll")
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      const tbody = document.querySelector("#tablaFormModule tbody");
      tbody.innerHTML = "";

    count = 1; // contador

      data.forEach((FormModule) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
                    <td>${count++}</td>
                    <td>${FormModule.formId}</td>
                    <td>${FormModule.moduleId}</td>
                    <td>${FormModule.formName}</td>
                    <td>${FormModule.moduleName}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="Modificar(${FormModule.id}, '${FormModule.formId}', '${FormModule.moduleId}')">Actualizar</button>
                        <select id="strategy-${FormModule.id}" class="form-select form-select-sm" style="width: auto; display: inline-block;">
                            <option value="Logical">Lógico</option>
                            <option value="Permanent">Persistente</option>
                        </select>
                        <button class="btn btn-sm btn-danger" onclick="Eliminar(${FormModule.id})">Eliminar</button>
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

async function Modificar(id, formId, moduleId) {
    document.getElementById("FormModuleId").value = id;
  
    // Cargar selects del modal
    await cargarSelects("formIdUpdate", "moduleIdUpdate");
  
    // Establecer valores seleccionados
    document.getElementById("formIdUpdate").value = formId;
    document.getElementById("moduleIdUpdate").value = moduleId;
  
    const modal = new bootstrap.Modal(document.getElementById("Actualizar"));
    modal.show();
  }
  

document
  .getElementById("ActualizarFormModule")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      id: parseInt(document.getElementById("FormModuleId").value),
      formId: document.getElementById("formIdUpdate").value,
      moduleId: document.getElementById("moduleIdUpdate").value,
    };

    fetch("https://localhost:7258/api/FormModule/Update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((resp) => {
       // console.log(data)
      if (resp.ok) {
        bootstrap.Modal.getInstance(
          document.getElementById("Actualizar")
        ).hide();
        ListaFormModules()
        alert("FormModule actualizado");
      } else {
        alert("Error al actualizar el FormModule");
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
    if (confirm("¿Estás seguro de que deseas eliminar este FormModule?")) {
        fetch(`https://localhost:7258/api/FormModule/Delete/${id}?strategy=${strategy}`, {
          method: "DELETE"
        })
          .then((resp) => {
            if (resp.ok) {
              alert("FormModule eliminado");
              ListaFormModules(); 
            } else {
              alert("Error al eliminar el FormModule");
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
  
async function cargarSelects(formSelectId = "formId", moduleSelectId = "moduleId") {
    const formSelect = document.getElementById(formSelectId);
    const moduleSelect = document.getElementById(moduleSelectId);
  
    // Cargar formularios
    const formResponse = await fetch("https://localhost:7258/api/Form/GetAll");
    const forms = await formResponse.json();
    formSelect.innerHTML = "";
    forms.forEach(form => {
      const option = document.createElement("option");
      option.value = form.id;
      option.textContent = form.name;
      formSelect.appendChild(option);
    });
  
    // Cargar módulos
    const moduleResponse = await fetch("https://localhost:7258/api/Module/GetAll");
    const modules = await moduleResponse.json();
    moduleSelect.innerHTML = "";
    modules.forEach(module => {
      const option = document.createElement("option");
      option.value = module.id;
      option.textContent = module.name;
      moduleSelect.appendChild(option);
    });
  }
  