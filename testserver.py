from fastapi import FastAPI

from starlette.middleware.cors import CORSMiddleware
import uvicorn
import socketio

app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# mount the socket coming from the routers/game.py file
# sio_asgi_app = socketio.ASGIApp(socketio_server=sio, other_asgi_app=app)
# app.add_route("/socket.io/", route=sio_asgi_app)
# app.add_websocket_route("/socket.io/", route=sio_asgi_app)

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*')
sio_app = socketio.ASGIApp(sio, other_asgi_app=app)

# app.add_route('/socket.io/', sio_app)
# app.add_websocket_route("/socket.io/", route=sio_app)

# app.mount('/socket.io/', sio_app)

@sio.event
async def connect(sid, environ):
    print('connect', sid)

@sio.event
async def disconnect(sid):
    print('disconnect', sid)



if __name__ == "__main__":
    uvicorn.run(sio_app, port=8000 , debug=True)