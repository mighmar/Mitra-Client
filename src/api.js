import io from 'socket.io-client';
import { create } from 'domain';
const socket = io('https://sheltered-mountain-90809.herokuapp.com/',{secure:true});
//const  socket = openSocket('http://localhost:3001');

function addUser() {
  socket.emit('add user', 'Filip');
  socket.on('login', timestamp => {console.log('Socket opened');});
  //socket.emit('addUser', 1000);
}

function createSheet(sheetIdCall){
  let newSheet={
    "name":"New spreadsheet"
  };
  socket.emit("create sheet",newSheet);
  socket.on("new sheet", sheetId=> sheetIdCall(sheetId));
}

function openSheet(username, sheetId){
  let message={
    "sheetId":sheetId,
    "name":username
  };
  //alert(JSON.stringify(message));
  socket.emit("open sheet",message);
}

function globalOpenSheet(openSheetCallback){
  socket.on("sheet data",sheetData=> openSheetCallback(sheetData));

}

function onUserCellChange(changeCellCallback){
  socket.on("cell selected", cellInfo=> changeCellCallback(cellInfo));

}

function cellValueChange(data){
  socket.emit("write to cell", data);
}

function cellStyleChange(data){
  socket.emit("change cell style", data);
}

function globalCellValueChange(globalHandleCellValueChange){
  socket.on("cell written to",data=>globalHandleCellValueChange(data) );
}

function globalCellStyleChange(globalHandleCellStyleChange){
  socket.on("cell changed syle",data=>{ globalHandleCellStyleChange(data); });
}

function visitedSheets(username){
  socket.emit("visited sheets",username);

}

function globalSheetsVisited(globalHandleSheetsVisited){
  socket.on("sheets visited",data=>{ globalHandleSheetsVisited(data); });

}
function globalSheetsVisitedUnmount(globalHandleSheetsVisited){
  socket.removeEventListener("sheets visited");

}

function selectCellUsers(cellCoord){
  socket.emit("select cell",cellCoord);
}

function closeSheet(sheetIdCall){
  let newSheet={
    "name":"New spreadsheet"
  };
  socket.emit("create sheet",newSheet);
  socket.on("new sheet", sheetId=> sheetIdCall(sheetId));
}
export {globalSheetsVisitedUnmount,visitedSheets, globalSheetsVisited, globalCellStyleChange , cellStyleChange, globalCellValueChange,cellValueChange, addUser,createSheet,openSheet,onUserCellChange,selectCellUsers,globalOpenSheet};
