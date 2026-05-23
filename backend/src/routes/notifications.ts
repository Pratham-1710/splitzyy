import Router from 'express'
import prisma from '../prisma'
// import { authMiddleware } from '../middlewares/auth';
import { authMiddleware } from '../middlewares/auth';

const router = Router();


router.get("/",authMiddleware, async(req,res) => {
       
      try {
                
        const notifications = await prisma.notification.findMany({
             where: {userId: req.userId,isRead:false},
             orderBy: {createdAt: "desc"},
             take: parseInt(req.query.limit as string) || 5
        })
        console.log("notification came", notifications);
  res.json(notifications); // send them back to frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id/read", authMiddleware, async(req,res) => {
         
        const {id} = req.params;

           if(!req.userId){
               return res.status(404).json({message: "user not found"});
           }
        const userId = req.userId;

        try {
              const notification = await prisma.notification.updateMany({
                 where: { id },
                 data: { isRead: true },
              });
              
              if (notification.count === 0) {
      return res.status(404).json({ message: "Notification not found or unauthorized" });
    }

    res.json({ success: true, message: "Notification marked as read", notification });
        } catch (error) {
              console.error(error);
              res.status(500).json({ error: "Server error" });
        }
})


router.patch("/mark-all", authMiddleware, async(req,res) => {
         
            const userId = req.userId;

            try {
                   await prisma.notification.updateMany({
                      where: { userId},
                      data: { isRead: true}
                   })

          res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking all notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;