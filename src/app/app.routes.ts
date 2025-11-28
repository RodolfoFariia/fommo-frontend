import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';

export const routes: Routes = [
    {
        path:'',
        component: Home,
        title: 'FOMMO - Home'
    },
    {
        path:'login',
        component: Login,
        title: 'FOMMO - Entrar'
    },
    {
        path:'register',
        component: Register,
        title: 'FOMMO - Cadastro'
    },
    {
        // rota coringa: qualque rota aleatoria redireciona para a home
        path:'**',
        redirectTo:''
    }
];
