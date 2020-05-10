// import socketIO from "socket.io-client"
import io from 'socket.io-client'

import { SIO_URL } from './paths'

const socket = io(SIO_URL)  

export { socket }