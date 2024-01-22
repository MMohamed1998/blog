import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";



export const token=Joi.object({
    token:Joi.string().required(),
}).required()

export const signup =Joi.object({
    firstName:Joi.string().min(2).max(20).required(),
    lastName:Joi.string().min(2).max(20).required(),
    email:generalFields.email,
    gender:Joi.string().valid('male','female'),
    password:generalFields.password,
    cPassword:generalFields.cPassword.valid(Joi.ref('password'))
}).required()

export const login =Joi.object({
    email:generalFields.email,
    password:generalFields.password,
}).required()
