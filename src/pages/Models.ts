export interface NamedImage {
    id: string
    name: string
    link: string
}

export interface Reward {
    user: NamedImage
    items: NamedImage[]
}