let nav = document.getElementById('nav');
nav.innerHTML = `
<nav class="navbar navbar-expand-lg bg-body-tertiary ">
        <div class="container-fluid color-nav">
          <a class="navbar-brand" href="index.html">API_Front</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="Person.html">Person</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="User.html">User</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="Rol.html">Rol</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="Permission.html">Permission</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="Module.html">Module</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="Form.html">Form</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="RolUser.html">RolUser</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="FormModule.html">FormModule</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="RolFormPermission.html">RolFormPermission</a>
              </li>
              <!-- <li class="nav-item">
                <a class="nav-link disabled" aria-disabled="true">Disabled</a>
              </li> -->
            </ul>
          </div>
        </div>
      </nav>
`;

