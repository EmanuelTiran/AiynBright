import { createCarpet, readCarpetById, readCarpets ,readCarpet} from "@/server/DL/controllers/carpet.controller";


export const createCarpetService = (data) => createCarpet(data)
export const readCarpetsService = (filter) => readCarpets(filter)
export const readCarpetByIdService = (id) => readCarpetById(id)
export const readCarpetByFieldService = (filter) => readCarpet(filter)