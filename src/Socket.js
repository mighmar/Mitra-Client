import openSocket from 'socket.io-client';
const  socket = openSocket('https://sheltered-mountain-90809.herokuapp.com/');

function userManagement(cb) {
  socket.on('login', user => console.log("Ulogovan user: "+user));
  socket.emit('add user', "User"+(Date.now()));
}
export { userManagement };
