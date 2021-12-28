import {NamedImage, Reward} from "../pages/Models";

const BASE_URL = 'http://planolyth.com:8000'
const LOGIN_URL = `${BASE_URL}/users`
const GET_ITEMS_URL = `${BASE_URL}/gaym/items`
const GET_USERS_URL = `${BASE_URL}/gaym/users`
const GRANT_URL = `${BASE_URL}/gaym/grant`
const GET_REWARDS_URL = `${BASE_URL}/gaym/reward`

function makeRequest<T>(url: string, method: string, data?: any): Promise<T> {
    const userId = localStorage.getItem("userId")
    let headers = {}
    if (userId)
        headers = {'X-User-ID': userId}
    return fetch(url, {method: method, body: data, headers: headers})
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

function getItems(): Promise<NamedImage[]> {
    return get<NamedImage[]>(`${GET_ITEMS_URL}`)
}

function getAvailableUsers(): Promise<NamedImage[]> {
    return get<NamedImage[]>(`${GET_USERS_URL}`)
}

function getGiftedItems(): Promise<Reward> {
    return get<Reward>(`${GET_REWARDS_URL}`)
}

function grant(userId: string, itemId: string): Promise<void> {
    return post(`${GRANT_URL}`, {user_id: userId, item_id: itemId})
}

export {login, getItems, getAvailableUsers, getGiftedItems, grant}