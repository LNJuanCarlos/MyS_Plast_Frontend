import { Producto } from "../producto/producto";

export class Itemtransaccion{

    id_ITEMTRANSACCION:number;
    linea: number;
    cantidad: number;
    id_PRODUCTO: Producto;
    id_TRAN: string;

}