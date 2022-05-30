import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios';

function App() {
  const baseurl = 'https://localhost:7092/api/Permisos';
  const [data, setData] = useState([]);
  const [permissionsType, setpermissionsType] = useState([]);
  const [modalSave, setModalSave] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const [permissionSelected, setPermissionSelected] = useState({
    id: 0,
    nombreEmpleado: '',
    apellidoEmpleado: '',
    tipoPermiso: 0
  });

  const handlechange = e => {
    const { name, value } = e.target;
    setPermissionSelected({
      ...permissionSelected,
      [name]: value
    })
  };

  const openCloseModalSave = () => {
    setModalSave(!modalSave);
  }

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
  }

  const permissionSelect = (permission, casePermission) => {
    setPermissionSelected(permission);
    (casePermission === "Edit") && openCloseModalEdit();
  }

  const peticionGet = async () => {
    await axios.get(baseurl)
      .then((response) => {
        setData(response.data);
      }).catch((error) => {
        console.log(error);
      })
  }

  const peticionGetPermissionsType = async () => {
    await axios.get(`${baseurl}/tipoPermisos`)
      .then((response) => {
        setpermissionsType(response.data);
      }).catch((error) => {
        console.log(error);
      })
  }

  const peticionPost = async () => {
    await axios.post(baseurl, permissionSelected)
      .then(() => {
        peticionGet();
        openCloseModalSave()
      }).catch((error) => {
        console.log(error);
      })
  }

  const peticionPut = async () => {
    await axios.put(`${baseurl}/${permissionSelected.id}`, permissionSelected)
      .then(() => {
        peticionGet();
        openCloseModalEdit()
      }).catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    peticionGet();
    peticionGetPermissionsType();
  }, [])

  return (
    <div className="App">
      <br /><br />
      <button onClick={() => openCloseModalSave()} className="btn btn-primary">Crear permiso</button>
      <br /><br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del empleado</th>
            <th>Apellido del empleado</th>
            <th>Tipo de permiso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(permission => (
            <tr key={permission.id}>
              <td>{permission.id}</td>
              <td>{permission.nombreEmpleado}</td>
              <td>{permission.apellidoEmpleado}</td>
              <td>{permission.tipoPermisos.descripcion}</td>
              <td>
                <button className="btn btn-success" onClick={() => permissionSelect(permission, "Edit")}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalSave}>
        <ModalHeader></ModalHeader>
        <ModalBody>
          <div>
            <label>Nombre del empleado:</label>
            <br />
            <input type="text" name="nombreEmpleado" className="form-control" onChange={handlechange} />
            <label>Apellido del empleado:</label>
            <br />
            <input type="text" name="apellidoEmpleado" className="form-control" onChange={handlechange} />
            <label>Tipo de Permiso:</label>
            <br />
            <select type="text" name="tipoPermiso" className="form-control" onChange={handlechange}>
              {permissionsType.map((permission) => (
                <option value={permission.id}>{permission.descripcion}</option>
              ))}
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={() => peticionPost()}>Guardar</button>
          <button className="btn btn-danger" onClick={() => openCloseModalSave()}>Cancelar</button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalEdit}>
        <ModalHeader></ModalHeader>
        <ModalBody>
          <div>
            <label>ID:</label>
            <br />
            <input type="text" name="id" className="form-control" disabled value={permissionSelected && permissionSelected.id} />
            <label>Nombre del empleado:</label>
            <br />
            <input type="text" name="nombreEmpleado" className="form-control" onChange={handlechange} value={permissionSelected && permissionSelected.nombreEmpleado} />
            <label>Apellido del empleado:</label>
            <br />
            <input type="text" name="apellidoEmpleado" className="form-control" onChange={handlechange} value={permissionSelected && permissionSelected.apellidoEmpleado} />
            <label>Tipo de Permiso:</label>
            <br />
            <select type="text" name="tipoPermiso" className="form-control" onChange={handlechange} value={permissionSelected && permissionSelected.tipoPermiso}>
              {permissionsType.map((permission) => (
                <option value={permission.id}>{permission.descripcion}</option>
              ))}
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={() => peticionPut()}>Editar</button>
          <button className="btn btn-danger" onClick={() => openCloseModalEdit()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
