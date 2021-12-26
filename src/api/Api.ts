const BASE_URL = '/ny2022/api'
const LOGIN_URL = `${BASE_URL}/gay`
const GET_ITEMS_URL = `${BASE_URL}/items`

function makeRequest<T>(url: string, method: string, data?: any): Promise<T> {
    return fetch(url, {method: method, body: data})
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json() as Promise<T>
        })
        .then(response => {
            console.log(response)
            return response
        })
}

function get<T>(url: string): Promise<T> {
    return makeRequest(url, 'GET')
}

function post<IN, OUT>(url: string, data?: IN): Promise<OUT> {
    return makeRequest(url, 'POST', data)
}

function login(id: string): Promise<string> {
    return get<{ name: string }>(`${LOGIN_URL}/${id}`)
        .then(response => response.name)
}

function getItems(): Promise<[{name: string, image: string}]> {
    return get<[{name: string, image: string}]>(`${GET_ITEMS_URL}/${localStorage.getItem('userId')}`)
}

function getAvailableUsers(): Promise<[{name: string, image: string}]> {
    return get<[{name: string, image: string}]>(`${GET_ITEMS_URL}/${localStorage.getItem('userId')}/gays`)
}

function getGiftedItems(): Promise<[{name: string, image: string}]> {
    return get<[{name: string, image: string}]>(`${GET_ITEMS_URL}/${localStorage.getItem('userId')}/granted`)
}

function grant(name: string, userName: string): Promise<void> {
    return post(`${GET_ITEMS_URL}/${localStorage.getItem('userId')}/${name}/grant/${userName}`)
}

export {login, getItems, getAvailableUsers, getGiftedItems, grant}