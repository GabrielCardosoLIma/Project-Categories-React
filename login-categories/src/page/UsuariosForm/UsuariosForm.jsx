import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { Form, Button, Container, Alert, FloatingLabel  } from 'react-bootstrap';

const initialValue = {
    name: '',
    email: '',
    password: ''
}

export const UsuariosFormView = () => {

    const history = useHistory();

    const [values, setValues] = useState(initialValue);
    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    })

    const [image, setImage] = useState("");
    const [endImage, setEndImage] = useState("");

    useEffect(() => {

        const getUser = async () => {
            const headers = {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            }

            await api.get("/user/view-profile" + localStorage.getItem('user'), headers)
                .then((response) => {
                    if (response.data.user) {
                        setValues(response.data.user);
                        setEndImage(response.data.endImagem);
                    } else {
                        setStatus({
                            type: 'warning',
                            mensagem: 'Usuário não encontrado!!!',
                        })
                    }
                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'error',
                            mensagem: err.response.data.mensagem
                        })
                    } else {
                        setStatus({
                            type: 'error',
                            mensagem: 'Erro: Tente mais tarde!'
                        })
                    }
                })
        }
         getUser();

    }, [])

    const formSubmit = async e => {
        e.preventDefault();
        setStatus({ loading: true });

        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        }
            await api.put("/user", values, headers)
                .then((response) => {
                    setStatus({ loading: false })
                    return history.push('/usuarios')
                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'error',
                            mensagem: err.response.data.mensagem,
                            loading: false
                        })
                    } else {
                        setStatus({
                            type: 'error',
                            mensagem: 'Erro: tente mais tarde',
                            loading: false
                        })
                    }

                })
        } 

    return (
        <>
            <Container className="box">
                <Form onSubmit={formSubmit} className="borderForm">
                    <h2>Usuário</h2>

                    {status.type == 'error'
                        ? <Alert variant="danger">{status.mensagem}</Alert>
                        : ""}
                    {status.type == 'success'
                        ? <Alert variant="success">{status.mensagem}</Alert>
                        : ""}

                    {status.loading ? <Alert variant="warning">Enviando...</Alert> : ""}

                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="name" name="name" value={values.name} placeholder="Entre com seu Nome" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={values.email} placeholder="Entre com seu email" />
                        <Form.Text className="text-muted">
                            Nunca compartilharemos seu e-mail com mais ninguém.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        {/* <Form.Check type="checkbox" label="Check me out" /> */}
                    </Form.Group>
                    {status.loading
                        ? <Button variant="primary" disabled type="submit">Enviando...</Button>
                        : <Button variant="primary" type="submit">Enviar</Button>
                    }

                </Form>
            </Container>
        </>
    )
}