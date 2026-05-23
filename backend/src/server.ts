// import app from "./app";
// import serverless from "serverless-http";

// export default serverless(app);


import app from "./app"

const PORT = process.env.PORT || 5000;


// for it to be worked on vercel
app.listen(PORT, ()=>{

     console.log(` Server is running at port no ${PORT}`);
})