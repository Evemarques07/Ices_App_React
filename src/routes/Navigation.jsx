import React from 'react'
import {createBrowserRouter} from 'react-router-dom'
import App from '../App.jsx'


import ErrorPage from '../pages/ErrorPage.jsx'
import Login from '../pages/Login.jsx'
import Home from '../pages/Home.jsx'
import YearSaidas from '../pages/YearSaidas.jsx'
import Contribuicoes from '../pages/Comtribuicoes.jsx'
import YearSelectionCont from '../pages/YearContribuicions.jsx'
import MonthSelection from '../pages/MonthSelection.jsx'
import Saidas from '../pages/Saidas.jsx'

const router = createBrowserRouter([
  {
    path: '/login', 
    element: <Login />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'contribuicoes',
        element: <YearSelectionCont />,
      },
      {
        path: 'contribuicoes/:year',
        element: <Contribuicoes />,
      },
      {
        path: 'saidas',
        element: <YearSaidas />,
      },
      {
        path: 'saidas/:mes',
        element: <MonthSelection />,
      },
      {
        path: 'saidas/detalhes',
        element: <Saidas />,
      },
    ],
  },
]);


  export default router;