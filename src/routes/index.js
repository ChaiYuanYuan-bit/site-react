import Login from "../views/Login";
import Register from "../views/Register";
import Layout from "../views/Layout";
import Mall from "../views/Mall";
import Detail from "../views/Mall/Detail";
import Buy from "../views/Mall/Buy";
import NotFound from '../views/NotFound';
import Pay from "../views/Mall/Pay";
import OrderInfo from "../views/OrderInfo";

//创建路由表
const routes = (props)=>[
    {
        path:'/home',
        element:<Layout {...props}/>,
        children:[
            {
                path:'mall',
		        element:<Mall {...props}/>,
                children:[
                    {
                        path:'detail',
		                element:<Detail {...props}/>,
                    },
                    {
                        path:'buy',
		                element:<Buy {...props}/>,
                    },
                    {
                        path:'pay',
		                element:<Pay {...props}/>,
                    }
                ]
            },
            {
                path:'myOrder',
                element:<OrderInfo {...props}/>,

            }
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
        element:<NotFound {...props}/>
    }
]
export default routes;