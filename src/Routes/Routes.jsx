import React from 'react';
import Main from "../../../big-bear-vite/src/layouts/Main/Main.jsx";
import HomePage from '../../../big-bear-vite/src/pages/Home/HomePage.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            {
                path: "/home",
                element: <HomePage></HomePage>
            }
        ]
    }
])

export default router;