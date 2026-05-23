import prisma from ".././prisma"


export const createNotifications = async(userId: string, message: string) => {
       return await prisma.notification.create({
          
          data: {userId, message}
       })
}