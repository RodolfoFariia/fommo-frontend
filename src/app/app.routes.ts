import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { User } from './pages/user/user';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
    {
        path:'',
        component: Home,
        title: 'FOMMO - Home'
    },
    {
        path:'login',
        component: Login,
        title: 'FOMMO - Entrar',
        canActivate:[guestGuard]
    },
    {
        path:'register',
        component: Register,
        title: 'FOMMO - Cadastro',
        canActivate:[guestGuard]
    },
    {
        path:'dashboard',
        component: Dashboard,
        title: 'FOMMO - Dashboard',
        canActivate:[authGuard]
    },
    {
        path:'usuario',
        component: User,
        title: 'FOMMO - Usuário',
        canActivate:[authGuard]
    },
    {
        // rota coringa: qualque rota aleatoria redireciona para a home
        path:'**',
        redirectTo:''
    }
];
