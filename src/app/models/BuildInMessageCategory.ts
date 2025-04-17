import { BuildInMessage } from "./BuildInMessage"

export interface BuildInMessageCategory {
    id:string,
    name: string,
    description:string,
    //BuildInMessage
    builtInMessages:BuildInMessage[]
}