import Login from "../views/Login";
import Layout from "../views/Layout";

//创建路由表
const routes = (props)=>[
    {
        path:'/layout',
        element:<Layout {...props}/>
    },
    {
        path:'/',
        element:<Login {...props}/>
    }
]
export default routes;