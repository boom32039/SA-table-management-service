require('dotenv').config();
import config from './config/config';
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import grpcTableManagementServices from "./grpc/definition/table.definition"
import tableManagement from "./grpc/implementation/table.implementation"
import {SyncDatabase} from './repositories/database'

main();

async function main(){
    await SyncDatabase();
    const server = new grpc.Server();
    await server.addService(tableManagement, grpcTableManagementServices);

    const url = config.host + ':' + config.port
    await server.bindAsync(url,grpc.ServerCredentials.createInsecure(), ()=>{server.start();});

    console.log("Server running at "  + url);
}


