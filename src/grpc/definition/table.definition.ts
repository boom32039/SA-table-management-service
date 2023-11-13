// import GetTableStatus from '../controllers/table.controller'
// import BookSeat  from '../controllers/table.controller'
// import CancelSeat from '../controllers/table.controller'
// import UpdateTableStatus  from '../controllers/table.controller'
import TableController from '../../controllers/table.controller'


const tableController = new TableController()
 
const grpcTableManagementServices = {
    GetTables: tableController.GetTables,
    BookSeat : tableController.BookSeat,
    CancelSeat : tableController.CancelSeat,
    CheckIn : tableController.CheckIn,
    VerifyCheckIn : tableController.VerifyCheckIn,
    CheckOut : tableController.CheckOut,
    DeleteLateTables: tableController.DeleteLateTables
}

export default grpcTableManagementServices
