/**
 * Registar
 */

document
  .getElementById("registerPerson")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const typeDocument = document.getElementById("typeDocument").value;
    const numberDocument = document.getElementById("numberDocument").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const bloodType = document.getElementById("bloodType").value;

    const data= {
      name: name,
      lastName: lastName,
      email: email,
      documentType: typeDocument,
      documentNumber: numberDocument,
      phone: phone,
      address: address,
      bloodType: bloodType,
    };
    console.log(data);  

    try{
        const response = await fetch("https://localhost:7258/api/Person/Create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          ListaPersonas();
          alert("Registro exitoso");
        }else{
            alert("Error en el registro");
        }
    }catch (error) {
        console.error("Error:", error);
        alert("Error en el registro");
    }

  });

  /**
   * 
   * Listar
   * 
   */


  document.addEventListener("DOMContentLoaded", ListaPersonas);

function ListaPersonas(){
    fetch("https://localhost:7258/api/Person/GetAll")
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      const tbody = document.querySelector("#tablaPerson tbody");
      tbody.innerHTML = "";
      let count = 1;
      data.forEach((Person) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
                    <td>${count++}</td>
                    <td>${Person.name}</td>
                    <td>${Person.lastName}</td>
                    <td>${Person.email}</td>
                    <td>${Person.documentType}</td>
                    <td>${Person.documentNumber}</td>
                    <td>${Person.phone}</td>
                    <td>${Person.address}</td>
                    <td>${Person.bloodType}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="Modificar(${Person.id}, '${Person.name}', '${Person.lastName}', '${Person.email}', '${Person.documentType}', '${Person.documentNumber}', '${Person.phone}','${Person.address}','${Person.bloodType}')">Actualizar</button>
                        <select id="strategy-${Person.id}" class="form-select form-select-sm" style="width: auto; display: inline-block; margin:7px;">
                            <option value="Logical">Lógico</option>
                            <option value="Permanent">Persistente</option>
                        </select>
                        <button class="btn btn-sm btn-danger" onclick="Eliminar(${Person.id})">Eliminar</button>
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

function Modificar(id, name, lastName, email, documentType, documentNumber, phone, address, bloodType) {
    document.getElementById("personId").value = id;
    document.getElementById("nameUpdate").value = name;
    document.getElementById("lastNameUpdate").value = lastName;
    document.getElementById("emailUpdate").value = email;
    document.getElementById("typeDocumentUpdate").value = documentType;
    document.getElementById("numberDocumentUpdate").value = documentNumber;
    document.getElementById("phoneUpdate").value = phone;
    document.getElementById("addressUpdate").value = address;
    document.getElementById("bloodTypeUpdate").value = bloodType;
  
    const modal = new bootstrap.Modal(document.getElementById("Actualizar"));
    modal.show();
  }


  document.getElementById("ActualizarPerson").addEventListener("submit", function (e) {
    e.preventDefault();
    const data = {
        id: parseInt(document.getElementById("personId").value),
        name: document.getElementById("nameUpdate").value,
        lastName: document.getElementById("lastNameUpdate").value,
        email: document.getElementById("emailUpdate").value,
        documentType: document.getElementById("typeDocumentUpdate").value,
        documentNumber: document.getElementById("numberDocumentUpdate").value,
        phone: document.getElementById("phoneUpdate").value,
        address: document.getElementById("addressUpdate").value,
        bloodType: document.getElementById("bloodTypeUpdate").value,
    }
    // console.log(data);
    fetch("https://localhost:7258/api/Person/Update/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((resp) => {
        if (resp.ok) {
            bootstrap.Modal.getInstance(
                document.getElementById("Actualizar")
            ).hide();
            alert("Actualización exitosa");
            ListaPersonas();
        } else {
            alert("Error en la actualización");
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
    if (confirm("¿Estás seguro de que deseas eliminar esta Persona?")) {
        fetch(`https://localhost:7258/api/Person/Delete/${id}?strategy=${strategy}`, {
          method: "DELETE"
        })
          .then((resp) => {
            if (resp.ok) {
              alert("Persona eliminada");
              ListaPersonas(); 
            } else {
              alert("Error al eliminar el Persona");
            }
          })
          .catch((error) => {
            console.error("Error en la petición DELETE:", error);
            alert("Error de conexión al intentar eliminar");
          });
      }
}


