const urlApi = "http://localhost:5678/api/"
async function getCategories () {
    const response = await fetch(urlApi+"categories")
    return await response.json()
}

async function getWorks () {
    const response = await fetch(urlApi+"works")
    return await response.json()
}

async function getlogin () {
    const response = await fetch(urlApi+"users/login")
    return await response.json()
}