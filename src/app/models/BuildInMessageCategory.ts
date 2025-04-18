import { BuildInMessage } from "./BuildInMessage"

export interface BuildInMessageCategory {
    id:string,
    name: string,
    description:string,
    type : 0,
    builtInMessages:BuildInMessage[]
}