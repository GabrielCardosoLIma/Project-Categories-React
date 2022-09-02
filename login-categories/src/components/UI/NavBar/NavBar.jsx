import React, { useContext } from "react";
import { Context } from "../../../context/AuthContext";
import { Navbar, Container, Nav, Form, Button } from "react-bootstrap";
import './style.css'

export const NavBar = () => {
  const { authenticated, handleLogout } = useContext(Context);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container className="aling-navbar">
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
    </>
  );
};
