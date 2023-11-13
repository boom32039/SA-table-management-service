import  myDataSource  from "../repositories/database"
import { CheckIn } from "../repositories/entity/checkInRequest.entity"; 
import { Table } from '../repositories/entity/table.entitiy'
import { TABLE_STATUS } from "../repositories/entity/table.entitiy";
import { v4 as uuidv4 } from 'uuid';

export default class TableService {

    private tableRepository = myDataSource.getRepository(Table);
    private checkInRequestRepository = myDataSource.getRepository(CheckIn);
    
    async mockData() {
        console.log(1321233120931230913912);
        const count = await this.tableRepository.count() 
        if (!count) {
            for (let i = 1 ; i <= 6 ; i++){
                const table : Table = {
                    id: String(uuidv4()),
                    label: i,
                    size: 4,
                    userId: "",
                    status: TABLE_STATUS.AVAILABLE,
                    checkIns: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                await this.tableRepository.save(table)
            }
            for (let i = 7 ; i <= 11 ; i++){
                const table : Table = {
                    id: String(uuidv4()),
                    label: i,
                    size: 6,
                    userId: "",
                    status: TABLE_STATUS.AVAILABLE,
                    checkIns: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                await this.tableRepository.save(table)              
            }
            for (let i = 12 ; i <= 14 ; i++){
                const table : Table = {
                    id: String(uuidv4()),
                    label: i,
                    size: 10,
                    userId: "",
                    status: TABLE_STATUS.AVAILABLE,
                    checkIns: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                await this.tableRepository.save(table)
            }
        }
    }
    
    async getTables() {
        return await this.tableRepository.find();
    }

    async getTable(tableId : string) {
        return await this.tableRepository.findOne({where: { id : tableId }});
    }

    async getTableByFilter(filter:any) {
        return await this.tableRepository.findOne({where: filter});
    }

    async updateTable(tableId:string, updateDto:any){
        const table = await this.tableRepository.findOne({where: { id : tableId }});
        return this.tableRepository.save({
        ...table, // existing fields
            ...updateDto // updated fields
        });
    }

    async deleteLateTables(){
        const today = new Date();
        const currentHour = today.getHours();

        if (currentHour >= 21) {
            await this.tableRepository.createQueryBuilder()
            .update(Table)
            .set({ status: TABLE_STATUS.AVAILABLE })
            .where("status = :status", {status:TABLE_STATUS.RESERVED })
            .execute()
        };
        
        return await this.getTables()
    }

    async countTable(filter : any) {
        return await this.tableRepository.countBy(filter)
    }

    async createRequest(checkIn : CheckIn) {
        return await this.checkInRequestRepository.save(checkIn)
    }

    async getRequest(id : number){
        return await this.checkInRequestRepository.findOne({
            relations: {table : true},
            where: {id : id}
        })
    }
}