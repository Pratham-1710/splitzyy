import Router from "express"
import prisma from "../prisma"
import { authMiddleware } from "../middlewares/auth"


const router = Router()

// making the group
router.post("/",authMiddleware, async(req,res)=>{
         
      const {name} = req.body;

      if(!name){
         return res.status(400).json({error: "Group name is required"});
      }
       
      try {

       if (!req.userId) {
  return res.status(401).json({ error: "Unauthorized" });
}
           
        const group = await prisma.group.create({

            data: { name }
        });

        await prisma.groupMember.create({
            data: {
                groupId: group.id,
            userId: req.userId,
             role: "admin"
    }
        })

        res.status(201).json(group);
      } catch (error) {
          
          console.log("Error while creating group: ", error)

          res.status(500).json({error: "Internal server error"});
      }
})


router.get("/", authMiddleware, async(req,res)=>{
       
      try {
        
          const groups = await prisma.groupMember.findMany({
              where: {userId: req.userId},
              include: {group: true}

          })

        //   res.status(200).json(groups)

          res.status(200).json(groups.map(g => g.group))

      } catch (error) {
          
        //    console.log 
        res.status(500).json({error: "Internal server error"})
      }
})


// // add member to a group
// router.post("/:groupId/add-member", authMiddleware, async(req,res)=>{
        
//         const { groupId } = req.params;

//         // id of the user you want to be member of the group and role you want to give him 
//         const { userId, role } = req.body;

//         if( !userId ){
//             return res.status(400).json({error: "User Id is required to add member"});
//         }
        
//         try {
              
//             //check if group exist
//             const group = await prisma.group.findUnique({
//                 where: {id:groupId}
//             })

//             if(! group){
//                 return res.status(400).json({error: "Group not found"});
//             }

            
//             //check if user is member og group or not 
//             const existUser = await prisma.groupMember.findFirst({
//                 where:{groupId, userId}
//             })

//             if(existUser) return res.status(400).json({error: "User already in group"})
               

//                 const newMember = await prisma.groupMember.create({
//                     data: {
//                         userId,
//                         groupId,
//                         role: role || "member"
//                     }
//                 })

//                   res.status(201).json(newMember);

//         }   catch (error: any) {
//             console.error("Error adding member:", error);
//             res.status(500).json({ error: "Internal server error" });
//         }
// })


router.post("/:groupId/add-member", authMiddleware, async(req,res)=>{
    
     const {groupId} = req.params;

     const {email,role} = req.body;

      try {
             
          if (!email) {
              return res.status(400).json({ error: "Email is required to add member" });
            }

           if(!req.userId){
               return res.status(400).json({ error: "user is not there" });
            
           }
             
             
            
           const user = await prisma.user.findUnique({
               where: {email}
           })

           if(!user){
              return res.status(404).json({error: "User not found"})
           }


           const existUser = await prisma.groupMember.findFirst({
                  where: { groupId, userId:user.id}
             });

           
           if (existUser) return res.status(400).json({error: "User already in group"})
            
            const newMember = await prisma.groupMember.create({
                
               data : {
                 userId: user.id,
                 groupId,
                 role: role || 'member'
              
             },
               include: { user: true}
            })

            res.status(201).json(newMember)

          } catch (error) {
               
                        console.error("Error adding member:", error);
            res.status(500).json({ error: "Internal server error" });
        
      }
})

// Get group details by Id 
router.get("/:groupId", authMiddleware, async(req,res)=>{
           
          const { groupId } = req.params;

          try {
            
            //  const group = await prisma.group.findUnique({
            //        where:{id: groupId},
            //        include: { 
            //         members: {
            //             include: {
            //                 user: {
            //                     select: {
            //                         id: true, name: true, email: true
            //                     }}},
            //                 },
            //         expense:{
            //             include:{
            //                paidby:{
            //                     select: {id:true, name:true},
            //                },
            //                     splits: {include:
            //                         {user:{select: {id:true, name:true}}}
            //                     }

            //             }
            //         } 
            //     }
            //  })

                const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        expenses: {
          include: {
            paidBy: { select: { id: true, name: true } },
            splits: { include: { user: { select: { id: true, name: true } } } },
          },
        },
        settlements: {
          include: {
            from: { select: { id: true, name: true } },
            to: { select: { id: true, name: true } },
          },
        },
      },
    });

             if(!group) return res.status(404).json({ error: "Group not found"})

                return res.status(201).json(group)

          } catch (error: any) {
              
                 console.error("Error fetching group:", error);
                res.status(500).json({ error: "Internal server error" });

          }
})


// expense should only be ceated in groups no need for particulat expense route you can delete expenses.ts
router.post("/:groupId/add-expense", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { amount, description } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // check if group exists
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) return res.status(404).json({ error: "Group not found" });

    // ✅ check membership properly
    const member = await prisma.groupMember.findFirst({
      where: {
        groupId: groupId,
        userId: req.userId, // make sure authMiddleware sets req.userId
      },
    });
    

    if (!member) {
      return res.status(403).json({ error: "User not in group" });
    }

    if (!req.userId) {
      return res.status(401).json({ error: "User ID not found in request" });
    }

    // create expense
    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        paidById: req.userId,
        groupId,
      },
    });
     
     const payerName = await prisma.user.findUnique({
      where: {id: req.userId},
      select: {name:true}
     })

     const groupName = await prisma.group.findUnique({
        where: {id:groupId},
        select: {name:true}
     })

    // Notifications ppart
    const otherMembers = await prisma.groupMember.findMany({
      where:{
        groupId,
        userId: { not : req.userId}, // excluude the user 
      },
      select: {userId:true}
    })
            const totalMembers = otherMembers.length + 1; // including payer
          const splitAmount = amount / totalMembers;

    const notifications = otherMembers.map((m) =>({
         userId: m.userId,
         message: `amount 💵 ${amount} is added by ${payerName?.name} in group 🏦 ${groupName?.name} now you owe him ${splitAmount} more`,
         isRead: false,
    }))
        
      await prisma.notification.createMany({
          data:notifications
      })
      console.log(notifications)
    res.status(201).json({expense,notifications});
  } catch (error) {
    console.error(error);
    console.log("error",error)
    res.status(500).json({ error: "Server error" });
  }
});




// it gives user in place of name
// // calculating settlement of a group 
// router.get("/:groupId/settlements", authMiddleware, async(req,res)=>{
     
//      try {
//             const {groupId} = req.params;

//             if(!req.userId){
//                 return res.status(401).json({ error: "User ID not found in request" });
                 
//             }

                 
        
//             const expenses = await prisma.expense.findMany({
//                 where: {
//                    groupId
//                 },
//                 include:{
//                    paidBy: true, // who paid

//                    group:{
//                       include: { members: {include: {user:true}}}
//                    }
//                 }
//             })

//                 // if no expenses → nothing to settle
//             if (expenses.length === 0) {
//               return res.json({ settlements: [], balances: {} });
//             }


//             const balance: Record<string, number> = {};
//             // expenses of smae grp so member remain same do [0] or [1] or so on are same
//             const members = expenses[0].group.members;
            
//             //initial balance 0
//             members.forEach((m) => {
//               balance[m.userId] =0
//             })


//             for (const exp of expenses){
                 
//                 const share = exp.amount/members.length; //equal split

//                 // evry member will pay the amount
//                 for(const m of members){
//                     balance[m.user.id] -= share;
//                 }

//                 // the one who payed get amount added
//                 balance[exp.paidById] += exp.amount;
//             }

//              // 4️⃣ Convert balances into settlement transactions
//     const debtors: { userId: string; amount: number }[] = [];
//     const creditors: { userId: string; amount: number }[] = [];

        
//      for (const userId in balance) {
//       const amt = balance[userId];
//       if (amt < 0) debtors.push({ userId, amount: -amt }); // owes money
//       if (amt > 0) creditors.push({ userId, amount: amt }); // to receive money
//     }

//     const settlements: { from: string; to: string; amount: number }[] = [];
//     let i = 0, j = 0;

//     // 5️⃣ Match debtors with creditors until everyone is settled
//     while (i < debtors.length && j < creditors.length) {
//       const debtor = debtors[i];
//       const creditor = creditors[j];
//       const amount = Math.min(debtor.amount, creditor.amount);

//       settlements.push({
//         from: debtor.userId,
//         to: creditor.userId,
//         amount
//       });

//       debtor.amount -= amount;
//       creditor.amount -= amount;

//       if (debtor.amount === 0) i++;
//       if (creditor.amount === 0) j++;
//     }

//     // 6️⃣ Send response back
//     res.json({
//       settlements,
//       balance,
//     });

//   } catch (err) {
//     console.error("Error calculating settlements", err);
//     res.status(500).json({ error: "Something went wrong" });
//   }

// })



//   give name which user will give
// 📌 GET: Calculate settlements for a group
router.get("/:groupId/settlements", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!req.userId) {
      return res.status(401).json({ error: "User ID not found in request" });
    }

    // 1️⃣ Get all expenses in this group (with members & users)
    const expenses = await prisma.expense.findMany({
      where: { groupId },
      include: {
        paidBy: true, // the user who paid
        group: {
          include: { members: { include: { user: true } } }
        }
      }
    });

    // if no expenses → nothing to settle
    if (expenses.length === 0) {
      return res.json({ settlements: [], balances: {} });
    }

    // 2️⃣ Get all group members
    const members = expenses[0].group.members;

    // 3️⃣ Build userId → name map for easy lookup
    const userMap: Record<string, string> = {};
    members.forEach((m) => {
      userMap[m.userId] = m.user.name; // assuming User has "name"
    });

    // 4️⃣ Init balance sheet
    const balance: Record<string, number> = {};
    members.forEach((m) => {
      balance[m.userId] = 0;
    });

    // 5️⃣ Process each expense
    for (const exp of expenses) {
      const share = exp.amount / members.length; // equal split

      // every member owes their share
      for (const m of members) {
        balance[m.userId] -= share;
      }

      // the payer gets full amount back
      balance[exp.paidById] += exp.amount;
    }

    // 6️⃣ Separate debtors & creditors
    const debtors: { userId: string; amount: number }[] = [];
    const creditors: { userId: string; amount: number }[] = [];

    for (const userId in balance) {
      const amt = balance[userId];
      if (amt < 0) debtors.push({ userId, amount: -amt });
      if (amt > 0) creditors.push({ userId, amount: amt });
    }

    // 7️⃣ Create settlements
    const settlements: { from: string; to: string; amount: number }[] = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: userMap[debtor.userId], // use name
        to: userMap[creditor.userId], // use name
        amount
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount === 0) i++;
      if (creditor.amount === 0) j++;
    }

    // 8️⃣ Respond
    res.json({
      settlements,
      balance: Object.fromEntries(
        Object.entries(balance).map(([id, amt]) => [userMap[id], amt]) // replace id → name
      ),
    });

  } catch (err) {
    console.error("Error calculating settlements", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});



// for invite link 
router.post("/:groupId/invite", authMiddleware, async (req, res) => {

})


router.patch("/:groupId/delete",authMiddleware,async(req,res)=>{
  
})


export default router;