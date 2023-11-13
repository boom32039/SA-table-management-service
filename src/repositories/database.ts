import { DataSource} from "typeorm"
import config from "../config/config"
import {CheckIn} from './entity/checkInRequest.entity'
import {Table} from './entity/table.entitiy'
import TableService from '../services/table.service'
const myDataSource = new DataSource({
    type: "postgres",
    host: config.db_host,
    port: Number(config.db_port),
    username: config.db_user,
    password: config.db_pass,
    database: config.db_name,
    synchronize: true,
    entities: [CheckIn, Table]
})


export async function SyncDatabase(){
    
    const env = config.project_env? config.project_env : "development"

    console.log(`This server is run on ${env} environment`)

    try {
        await myDataSource.initialize();
        console.log("Data Source has been initialized!");
    } catch (err) {
        console.error("Error during Data Source initialization:", err);
    }

    try {
        await myDataSource.synchronize();
        console.log("Data Source has been synchronized!");
    } catch (err) {
        console.error("Error during Data Source synchronization:", err);
    }

    const tableService = await new TableService()
    await tableService.mockData()
}

export default myDataSource