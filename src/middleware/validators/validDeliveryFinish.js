import { body } from "express-validator";
import { mecanismDelivey } from "../../model/modelsDelivery.js";


export const validDeliveryFinish = [
    body("enfiLoca")
        .notEmpty().withMessage("ID da entrega obrigatorio.")
        .bail()
        .custom(async (value) => {
        if (!value || typeof value !== 'string') {
            throw new Error("ID da entrega inválido.");
        }
        return true;
        }),
    

    body("enfiNmlo")
        .notEmpty().withMessage("Numero da locaçaõ é obrigatório.")
        .bail(),
    
    
    body("enfiNmMt")
        .notEmpty().withMessage("Nome do motorista é obrigatório.")
        .bail(),
    
    body("enfiBem")
        .notEmpty().withMessage("ID do bem é obrigatório.")
        .bail()
        
]