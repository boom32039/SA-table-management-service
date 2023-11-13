import { TABLE_STATUS } from "../repositories/entity/table.entitiy";

export interface Seat {
    tableId : string;
    label: number ;
    size: number ;
    status: string;
    createdAt: string;
    userId: string;
}

export interface  GetTablesResponse {
    tables : Seat[]
}

export interface BookSeatRequest{
    userId: string;
    tableId: string;
}

export interface BookSeatResponse {
    tableId : string ;
    label : number;
    size : number ;
    status : string;
}

export interface CancelSeatRequest {
    userId: string;
    tableId: string;
}

export interface CancelSeatResponse {
    tableId: string;
    label: number;
    size: number;
    status: string;
}

export interface CheckInRequest {
    userId: string;
    tableId: string;
}

export interface CheckInResponse {
    userId: string;
    requestId: number;
    tableId: string;
    createdAt: string;
}

export interface CheckOutRequest {
    tableId: string;
}

export interface CheckOutResponse {
    tableId: string;
    status: string;
}

export interface VerifyCheckInRequest {
    requestId: number 
}

export interface VerifyCheckInResponse {
    tableId: string;
    status: string;
}

export interface DeleteLateTablesResponse{
    tables : Seat[]
}

