import { useEffect, useState } from 'react'
import { BrowserRouter,Routes,Route} from 'react-router-dom';
import './App.css'
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from './components/ProtectedRoute';
import GroupDetail from './pages/GroupDetail';
import AddExpense from './pages/AddExpense';
import GroupSettlements from './pages/GroupSettlements';
import Home from './pages/Home'

function App() {
  // const [count, setCount] = useState(0)

  const [user,setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);



  // if you refresh the window this will take place
  useEffect(() => {

   const storedUser = localStorage.getItem("user");
   const storedToken = localStorage.getItem("token");

  //  if(storedUser && storedToken){
        
  //     setUser(JSON.parse(storedUser));
  //     setToken(storedToken);

  //  }

   if(storedUser){
             setUser(JSON.parse(storedUser));
          //  console.log(user)
   }

   if(storedToken){
      setToken(storedToken);
      // console.log(token)
        
   }

  //  console.log("m chal rha hu")
  //  console.log("ye dekho",token,user)

  }, []);



// save to localstorage when user or token change
//   useEffect(() =>{
//         if(user && token){

//           localStorage.setItem("user", JSON.stringify(user));
//           localStorage.setItem("token", token);
//         }

//         else{
//             localStorage.removeItem("user");
//             localStorage.removeItem("token")
//         }
//   // }, [user, token])

// },[])


useEffect(() => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }

    // console.log("User changed:", user);
  }, [user]);
  
  
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    // console.log("Token changed:", token);
}, [token]);


  return (


   <BrowserRouter>
  <Routes>
    {/* Public Routes */}
    <Route path='/' element={<Home/>}/>
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login setUser={setUser} token={token} setToken={setToken} />} />

    {/* Protected Routes */}

    // only user logined can access
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute user={user} token={token}>
          
          <Dashboard user={user} token={token} focus={function (): HTMLInputElement {
            throw new Error('Function not implemented.');
          } } />
        </ProtectedRoute>
      }
    />
   
    {/* <Route
    path='/groups/:id'
    element= {<GroupDetail/>}
// `/groups/${group.id}`
    /> */}

    <Route 
    path="/groups/:groupId"
     element={<ProtectedRoute user={user} token={token}><GroupDetail /></ProtectedRoute>} />



     {/* <Route 
    path="/groups/:groupId"
     element={<GroupDetail />} /> */}



//protectedRoute ensure that if user is logged in then can access
    <Route
     path="/group/:groupId/add-expense"
         element={<ProtectedRoute user={user} token={token}><AddExpense /></ProtectedRoute>} 
     />

     <Route
      path='/group/:groupId/settlements'
      element= {<ProtectedRoute user={user} token={token}> <GroupSettlements/></ProtectedRoute>}
     />
    
  </Routes>
</BrowserRouter>


// <BrowserRouter>
//   <Routes>
//     {/* Default route: redirect based on auth */}
//     <Route
//       path="/"
//       element={
//         user && token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
//       }
//     />

//     {/* Public Routes */}
//     <Route path="/signup" element={<Signup />} />
//     <Route path="/login" element={<Login setUser={setUser} setToken={setToken} />} />

//     {/* Protected Route */}
//     <Route
//       path="/dashboard"
//       element={
//         <ProtectedRoute user={user}>
//           <Dashboard user={user} token={token} />
//         </ProtectedRoute>
//       }
//     />
//   </Routes>
// </BrowserRouter>

  

)
}

export default App
