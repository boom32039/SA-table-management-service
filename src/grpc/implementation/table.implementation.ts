const PROTO_PATH="./tableManagement.proto";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

var packageDefinition = protoLoader.loadSync(PROTO_PATH,{
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const tableManagementProto :grpc.GrpcObject  = grpc.loadPackageDefinition(packageDefinition) 

const tableManagementObject: grpc.GrpcObject = tableManagementProto.TableManagementService as grpc.GrpcObject

const tableManagement : grpc.ServiceDefinition = tableManagementObject.service as unknown as grpc.ServiceDefinition

export default tableManagement