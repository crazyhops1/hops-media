import  express from'express'
import { getMessage, sendMessage,getAllUserByhistory } from '../controller/message.controller.js'
import { tokenVerify } from '../verify/token.js'

const messageRouter=express.Router()


messageRouter.post('/send-message/:id',tokenVerify,sendMessage)
messageRouter.get('/get-message/:id',tokenVerify,getMessage)
messageRouter.get('/get-user-history',tokenVerify,getAllUserByhistory)



export default messageRouter