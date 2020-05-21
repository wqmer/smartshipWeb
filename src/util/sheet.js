import XLSX from 'xlsx'
import moment from 'moment'
 


export const generateSheet = function(req){
     req.forEach(record => {
        XLSX.writeFile(record.workbook, `${record.agentType}-${moment().format('MMMM Do YYYY h:mm a')}.xlsx`)
     });
     
 
}

