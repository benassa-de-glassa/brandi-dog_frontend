// to run it from local API
export const API_URL = "http://localhost:8000/v1/"
export const SIO_URL = "http://localhost:8000"

// export const WS_URL = "ws://localhost:8000/"

export var postData = async function(relURL = '', data = {}) {
    console.log('post')
    console.log(data)
    let url = new URL(relURL, API_URL)
    console.log(url)
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    return response.json()
}