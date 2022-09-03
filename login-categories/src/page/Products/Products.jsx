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

export const ListProducts = () => {

    const history = useHistory();

    const [data, setData] = useState([]);
    const [page, setPage] = useState();
    const [lastPage, setLastPage] = useState("")

    const [status, setStatus] = useState({
        type:'',
        mensagem:''
    })

    const confirmDelete = (Products) => {
        confirmAlert({
          title: "CAUTION !!!!",
          message:
            "Are you absolutely sure you want to delete section " +
            Products.id +
            "?",
          buttons: [
            {
              label: "Yes",
              onClick: () => handleDelete(Products.id)
            },
            {
              label: "No",
              onClick: () => history.push("/Products")
            }
          ]
        });
      };

    const handleDelete = async (idProducts) => {
        console.log(idProducts);

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.delete("/products/delete/"+idProducts, headers)
        .then( (response) => {
            setStatus({
                type: 'sucess',
                mensagem: response.data.mensagem
            })
            getUsers();
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

    const getProducts = async (page) => {

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

        await api.get("/products/all/", headers)
            .then( (response) => {
                setData(response.data.Products);
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
        getProducts();
    }, [])

    return(
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
            <Nav.Link href="/produtos/novo">Produtos</Nav.Link>
            <Nav.Link href="/">Sair</Nav.Link>
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
              <th>CategoriaId</th>
              <th>Funções</th>
            </tr>
          </thead>
          <tbody>
          {data.map((Products) => (
              <tr key={Products.id}>
                <td>{Products.id}</td>
                <td>{Products.name}</td>
                <td>{Products.description}</td>
                <td>{Products.categorieId}</td>
                <td>
                  <Button className="button-warning" variant="warning">
                    <Link
                      className="btnLink"
                      to={"products/update/" + Products.id}
                    >
                      Editar
                      <NotePencil size={18} color="#000" />
                    </Link>
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => confirmDelete(Products)}
                  >
                    Excluir
                    <Trash size={18} color="#fff" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
    )
}