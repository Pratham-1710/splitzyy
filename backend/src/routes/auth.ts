import {Router} from "express"
import prisma from "../prisma"
import jwt from "jsonwebtoken"

const router = Router();


router.post("/signup", async(req,res)=>{
      
      const {name,email,password} = req.body;

      try {
            
           const user = await prisma.user.create({
              data: {name,email,password}
           })

           res.json(user);
      } catch (error: any) {
          res.status(400).json({error: error.message})
      }
});


router.post("/login", async (req,res)=>{
      
      const {name,email,password} = req.body;

      try {
             const user = await prisma.user.findUnique({
                where:{email}
             });

             if(!user || user.password !== password){
                  return res.status(401).json({error: "Invalid credentials"});
             }
                 
             const secret = process.env.JWT_SECRET;
               if (!secret) {
                   return res.status(500).json({ error: "JWT secret not configured" });
                  }

             const token = jwt.sign({userId: user.id},secret)

             res.json({message: "Login successful", user,token})


      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
})


export default router;