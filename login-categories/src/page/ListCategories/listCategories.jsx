import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import api from "../../services/api";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { ListPlus } from "phosphor-react";
import { SignOut } from "phosphor-react";
import { NotePencil } from "phosphor-react";
import { Trash } from "phosphor-react";
import "./table.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export const ListCategories = () => {
  const history = useHistory();

  const [data, setData] = useState([]);
  const [page, setPage] = useState();
  const [lastPage, setLastPage] = useState("")
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const confirmDelete = (Categories) => {
    confirmAlert({
      title: "ATENÇÃO !!!!",
      message:
        "Você deseja excluir a categoria com o id:" +
        Categories.id +
        "?",
      buttons: [
        {
          label: "Sim",
          onClick: () => handleDelete(Categories.id),
        },
        {
          label: "Não",
          onClick: () => history.push("/listacategorias"),
        },
      ],
    });
  };

  const handleDelete = async (idUser) => {
    const valueToken = localStorage.getItem("token");
    const headers = {
      headers: {
        Authorization: "Bearer " + valueToken,
      },
    };
    await api
      .delete("/categories/delete/" + idUser, headers)
      .then((response) => {
        setStatus({
          type: "success",
          mensagem: response.data.mensagem,
        });
        getUsers();
      })
      .catch((err) => {
        if (err.response) {
          setStatus({
            type: "error",
            mensagem: err.response.data.mensagem,
          });
        } else {
          setStatus({
            type: "error",
            mensagem: "Erro tente mais tarde!!",
          });
        }
      });
  };

  const getUsers = async () => {
    const valueToken = localStorage.getItem("token");
    const headers = {
      headers: {
        Authorization: "Bearer " + valueToken,
      },
    };
    await api
      .get("/categories/all", headers)
      .then((response) => {
        setData(response.data.Categories);
      })
      .catch((err) => {
        if (err.response) {
          setStatus({
            type: "error",
            mensagem: err.response.mensagem,
          });
        } else {
          setStatus({
            type: "error",
            mensagem: "Erro: Tente mais tarde!",
          });
        }
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getCategories = async (page) => {

    if( page === undefined ) {
        page = 1
    }
    setPage(page);

    const valueToken = localStorage.getItem('token');
    const headers = {
        'headers': {
            'Authorization': 'Bearer ' + valueToken
        }
    }

    await api.get("/products/all/pages/" + page, headers)
        .then( (response) => {
            setData(response.data.products);
            setLastPage(response.data.lastPage);
            setStatus({loading: false})
        }).catch( (err) => {
            if(err.response){
                setStatus({
                    type:'error',
                    mensagem: err.response.data.mensagem
                })
            } else {
                setStatus({
                    type:'error',
                    mensagem: 'Erro: tente mais tarde...'
                })
            }
        })
}

useEffect( () => {
    getCategories ();
}, [])

  return (
    <div className="tabela">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Consulta Categorias</Navbar.Brand>
          <Nav>
            <Nav.Link className="aling-text" href="/categorias">
              Categorias
            </Nav.Link>
            <Nav.Link href="/listacategorias">Lista de Categorias</Nav.Link>
            <Nav.Link href="/profile">Perfil</Nav.Link>
            <Nav.Link href="/listaprodutos">Produtos</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="bg-ListCategories">
        <h1 className="h1-ListCategories">Lista de Categorias</h1>
        <div className="aling-buttons">
          <Button className="button-width " variant="success">
            <Link className="btnLinkList" to="/categories/create">
              Nova Categoria
              <ListPlus className="icon-listplus" color="#fff" size={22} />
            </Link>
          </Button>
          <Button className="button-width" variant="dark">
            <Link className="btnLinkList" to="/">
              Sair
              <SignOut className="icon-listplus" size={22} color="#fff" />
            </Link>
          </Button>
        </div>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Descrição</th>
              <th>Funções</th>
            </tr>
          </thead>
          <tbody>
            {data.map((Categories) => (
              <tr key={Categories._id}>
                <td>{Categories._id}</td>
                <td>{Categories.name}</td>
                <td>{Categories.description}</td>
                <td>
                  <Button className="button-warning" variant="warning">
                    <Link
                      className="btnLink"
                      to={"categories/update/" + Categories._id}
                    >
                      Editar
                      <NotePencil size={18} color="#000" />
                    </Link>
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => confirmDelete(Categories)}
                  >
                    Excluir
                    <Trash size={18} color="#fff" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
        { page !== 1
                ? <Button className="style-button-name" variant="dark" type="button" onClick={ () => getCategories (1)}>Primeira</Button>
                : <Button className="style-button-name" variant="dark" type="button" disabled>Primeira</Button>
            }{" "}
            { page !== 1
                ? <Button className="style-button" variant="dark" type="button" onClick={ () => getCategories (page - 1)}>{page - 1}</Button>
                : ""
            }{" "}
            <Button className="style-button" variant="dark" type="button" disabled>{page}</Button>{" "}
            {/* { page !== lastPage
                ? <Button className="style-button" variant="dark" type="button" onClick={ () => getCategories (page + 1)}>{page + 1}</Button>
                : ""
            }{" "} */}
            { page + 1 <= lastPage
                ? <Button className="style-button" variant="dark" type="button" onClick={ () => getCategories (page + 1)}>{page + 1}</Button>
                : ""
            }{" "}
            { page !== lastPage 
                ? <Button className="style-button-name" variant="dark" type="button" onClick={ () => getCategories (lastPage)}>Ultima</Button>
                : <Button className="style-button-name" variant="dark" type="button" disabled>Ultima</Button>
            }
        </div>
      </Container>
    </div>
  );
};
