import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Login } from '../components/Login/Login';
import { Categories } from '../page/Categories/Categories';
import { Context } from '../context/AuthContext';
import { ListCategories } from '../page/ListCategories/listCategories';
import { ListProducts } from '../page/Products/Products';
import { CategoriesForm } from '../page/CategoriesForm/categoriesForms';
import { UsuariosFormView } from '../page/UsuariosForm/UsuariosForm';
import { productsForm } from '../page/ProdutosForm/ProdutosForm';

function CustomRoute({ isPrivate, ...rest}){
    const { authenticated } = useContext(Context);
    if (isPrivate && !authenticated){
        return <Redirect to="/"  />
    }
    return <Route { ...rest } />
}

export default function PrivateRoute(){
    return (
        <Switch>
            <CustomRoute exact path="/" component={Login} />
            <CustomRoute isPrivate path="/categorias" component={Categories} />
            <CustomRoute isPrivate path="/listacategorias" component={ListCategories} />
            <CustomRoute isPrivate path="/categories/create" component={CategoriesForm} />
            <CustomRoute isPrivate path="/categories/update/:id" component={CategoriesForm} />
            <CustomRoute isPrivate path="/listaprodutos" component={ListProducts} />
            <CustomRoute isPrivate path="/products/create" component={productsForm} />
            <CustomRoute isPrivate path="/products/update/:id" component={productsForm} />
            <CustomRoute isPrivate path="/profile" component={UsuariosFormView} />
        </Switch>
    )
};