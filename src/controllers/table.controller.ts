import TableService  from "../services/table.service"
import {TABLE_STATUS} from '../repositories/entity/table.entitiy'
import {CheckIn} from '../repositories/entity/checkInRequest.entity'
import { v4 as uuidv4 } from 'uuid';
import {
  Seat,
  GetTablesResponse,
  BookSeatRequest,
  BookSeatResponse,
  CancelSeatRequest,
  CancelSeatResponse,
  CheckInRequest,
  CheckInResponse,
  VerifyCheckInRequest,
  VerifyCheckInResponse,CheckOutRequest,
  CheckOutResponse} from '../interfaces/table.interface'
  let grpc = require("@grpc/grpc-js");
export default class TableController {
  private tableService : TableService;

  async GetTables(_:any, callback:any){
    this.tableService = new TableService();
    console.log(this.tableService)

    const tables = await this.tableService.getTables()
    
    const seats: Seat[] = tables.map((table) => {
      let seat : Seat = {
        tableId: table.id,
        label: table.label,
        size: table.size,
        userId: table.userId,
        status: table.status.toUpperCase(),
        createdAt: String(table.createdAt),
      }
      return seat;
    });
    var response : GetTablesResponse = {tables: seats}
  
    callback(null, response)
  }

  async BookSeat(call:any, callback:any){
    this.tableService = new TableService();
    const bookSeatRequest : BookSeatRequest = {
      userId : call.request.userId,
      tableId : call.request.tableId
    }
    // target table 
    const tableTarget = await this.tableService.getTableByFilter({id : bookSeatRequest.tableId, status:TABLE_STATUS.AVAILABLE })
    // is there other table by reserve by user ? 
    const anotherUserTable = await this.tableService.getTableByFilter({userId : bookSeatRequest.userId, status:TABLE_STATUS.RESERVED })
    const today = new Date();
    const currentHour = today.getHours();
    if (tableTarget && !anotherUserTable && currentHour < 21){
      const data = await this.tableService.updateTable(bookSeatRequest.tableId, {userId:bookSeatRequest.userId ,status:TABLE_STATUS.RESERVED })
      console.log(data)
      const bookSeatResponse : BookSeatResponse = {
        tableId : data.id,
        label : data.label,
        size : data.size,
        status: data.status.toUpperCase()
      }
      console.log(bookSeatResponse)
      callback(null ,bookSeatResponse)
    }else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "NOT Found"
      })
    }

  }

  async CancelSeat(call:any, callback:any){
    this.tableService = new TableService();
    const cancelSeatSeatRequest : CancelSeatRequest = {
      userId : call.request.userId,
      tableId : call.request.tableId
    }
    // must be onwer of that table 
    const table = await this.tableService.getTableByFilter({id :cancelSeatSeatRequest.tableId , userId : cancelSeatSeatRequest.userId, status: TABLE_STATUS.RESERVED })
    if (table){
      const data = await this.tableService.updateTable(cancelSeatSeatRequest.tableId , {userId: "", status : TABLE_STATUS.AVAILABLE})
      const cancelSeatResponse : CancelSeatResponse = {
        tableId : data.id,
        label : data.label,
        size : data.size,
        status: data.status.toUpperCase(),
      }
      callback(null ,cancelSeatResponse)
    }else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "NOT Found"
      })
    }
  }

  async CheckIn(call:any, callback:any){
    this.tableService = new TableService();
    const checkInRequest : CheckInRequest = {
      userId : call.request.userId,
      tableId : call.request.tableId
    }
    const table = await this.tableService.getTableByFilter({id : checkInRequest.tableId})
    // reserved or walk in available table
    const isValid = (table?.userId == checkInRequest.userId && table.status == TABLE_STATUS.RESERVED) || (table?.status == TABLE_STATUS.AVAILABLE)
    if (isValid) {
      const checkIn = new CheckIn()
      checkIn.table = table
      checkIn.userId = checkInRequest.userId
      const result = await this.tableService.createRequest(checkIn);
      console.log(result);
      const checkInResponse : CheckInResponse = {
        userId: result.userId,
        requestId: result.id,
        tableId: result.table.id,
        createdAt: String(result.createdAt)
      }
      callback(null, checkInResponse)
    }else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "NOT Found"
      })
    }
  }

  async VerifyCheckIn(call:any, callback:any){
    this.tableService = new TableService();
    const verifycheckInRequest : VerifyCheckInRequest = {
      requestId : call.request.requestId,
    }

    const checkIn = await this.tableService.getRequest(verifycheckInRequest.requestId)
    console.log(checkIn)
    // const currentDate = new Date();
    // const tenMinutesLater = new Date(checkIn.createdAt.getTime() + 10 * 60 * 1000); 
    if (checkIn?.table.id){
      const result = await this.tableService.updateTable(checkIn?.table.id, {userId : checkIn.userId, status : TABLE_STATUS.FULL})
      let verifyCheckInResponse : VerifyCheckInResponse = {
        tableId : checkIn?.table.id,
        status: String(TABLE_STATUS.FULL)
      }
      callback(null, verifyCheckInResponse)
    }else{
      callback({
        code: grpc.status.NOT_FOUND,
        details: "NOT Found"
      })
    }
  }
  async CheckOut(call:any, callback:any){
    this.tableService = new TableService();
    const checkOutRequest : CheckOutRequest = {
      tableId: call.request.tableId
    }
    try {
      const result = await this.tableService.updateTable(checkOutRequest.tableId, {status: TABLE_STATUS.AVAILABLE})
      let checkOutResponse: CheckOutResponse = {
        tableId : result.id ,
        status : String(result.status)
      }
      callback(null, checkOutResponse)
    }catch {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "NOT Found"
      })
    }

  }

  async DeleteLateTables(_:any, callback:any){
    this.tableService = new TableService();

    const tables = await this.tableService.deleteLateTables();

    const seats: Seat[] = tables.map((table) => {
      let seat : Seat = {
        tableId: table.id,
        label: table.label,
        size: table.size,
        userId: table.userId,
        status: table.status.toUpperCase(),
        createdAt: String(table.createdAt),
      }
      return seat;
    });
    var response : GetTablesResponse = {tables: seats}
  
    callback(null, response)

  }
}
