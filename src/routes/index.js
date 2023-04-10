import Login from "../views/Login";
import Register from "../views/Register";
import Layout from "../views/Layout";
import Mall from "../views/Mall";
import NotFound from '../views/NotFound'

//创建路由表
const routes = (props)=>[
    {
        path:'/home',
        element:<Layout {...props}/>,
        children:[
            {
                path:'mall',
		        element:<Mall/>,
            },
        ]
    },
    {
        path:'/register',
        element:<Register {...props}/>
    },
    {
        path:'/',
        element:<Login {...props}/>
        // element:<Layout {...props}/>
    },
    {
        path:'*',
        element:<NotFound/>
    }
]
export default routes;