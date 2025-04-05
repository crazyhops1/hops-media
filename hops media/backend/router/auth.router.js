import express from'express'
import { createAccount, loginAccount } from '../controller/auth.controller.js'
const authRouter=express.Router()

authRouter.post('/create-account',createAccount)

authRouter.post('/login',loginAccount)

export default authRouter