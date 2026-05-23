import Router from "express"
import prisma from "../prisma"
import { authMiddleware } from "../middlewares/auth"

const router = Router();


router.post("/:groupId/balances",authMiddleware, async(req,res)=>{

      const {groupId} = req.params;

       try {
              
        // all the expense in grroup
          const expenses = await prisma.expense.findMany({
              where: { groupId},
              include: { splits:true}
          })

        //   console.log(expenses);


          // record thing is used to make balances aaray proof keys will be string values will be numbers
          const balances : Record<string,number> = {};



          expenses.forEach((expense)=>{
               
            // the one who pay get the amount
              balances[expense.paidById] = (balances[expense.paidById] || 0) + expense.amount;


              // they will pay to the one who payed for earlier so ther amount reduced
               expense.splits.forEach((split)=>{
                    balances[split.userId] = (balances[split.userId] || 0) - split.share;
               })
            })
  

            // find every member of group 
             const members = await prisma.groupMember.findMany({
                 where: { groupId },
                 include: { user: true },
             })

             // showing detail of every member
             const result = members.map((m) => ({
                 userId: m.userId,
                 name: m.user.name,
                 balance: balances[m.userId] || 0,
                 
             }));

             res.json(result);

       } catch (error) {
         
         console.error("Error fetching balances:", error);
    res.status(500).json({ error: "Internal server error" });
       }
})


export default router