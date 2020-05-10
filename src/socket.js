// import socketIO from "socket.io-client"
import io from 'socket.io-client'

import { API_URL } from './paths'

const socket = io(API_URL)  //, 
//     {
//         transports: ['websocket'],
//         jsonp: false
//     }
// )


export { socket }