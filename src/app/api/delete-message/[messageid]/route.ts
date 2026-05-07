import { getServerSession } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { success } from "zod";

import { authOptions } from "../../auth/[...nextauth]/options";

export async  function DELETE(request :Request , { params }: { params: Promise<{ messageid: string }>}){
    const {messageid} = await params
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user : User  = session?.user as User
     
      if(!session || !session.user){
        return Response.json({
            success: false ,
            message : "Not Authenticated"
        }, {status: 401})
       }

       try {
       const updateResult = await UserModel.updateOne(
            {_id : user._id} ,
            {$pull : {messages: {_id: messageid}}}
         )

         if(updateResult.modifiedCount == 0){
            return Response.json({
                success : false ,
                message : "Message Not found or already delete"
            }, {status : 404}) ;
         }

         return Response.json({
            success: true ,
            message : "Message Deleted"
         } , {status : 200})
       } catch(error){
        console.error("Errors occured in deleting " ,error) ;
        return Response.json({
            success: false ,
            message : "Error deleting message"
        } , {status : 500})
       }

     


}