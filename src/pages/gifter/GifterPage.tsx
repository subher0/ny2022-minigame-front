import React, {useEffect, useState} from "react";
import './GifterPage.css'
import {Button, FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import {NamedImage} from "../Models";
import {getAvailableUsers, getItems, grant} from "../../api/Api";
import {Link} from "react-router-dom";

interface CardProps {
    data: NamedImage
    isSelected: boolean

    onClick(): void
}

function GiftItemCard(props: CardProps) {
    let cardClassName = 'GifterPageItem'
    if (props.isSelected)
        cardClassName += ' GifterPageSelectedItem'
    return (<Grid item xs={11} lg={11} onClick={() => props.onClick()}>
        <Grid container justifyContent='center' className={cardClassName}>
            <Grid item xs={12} className='GifterPageItemName'>
                {props.data.name}
            </Grid>
            <Grid item xs={10}>
                <img src={`${props.data.link}`} className='GifterPageItemImage'/>
            </Grid>
        </Grid>
    </Grid>)
}

function UserCard(props: CardProps) {
    let cardClassName = 'GifterPageItem'
    if (props.isSelected)
        cardClassName += ' GifterPageSelectedItem'
    return (<Grid item xs={11} lg={11} onClick={() => props.onClick()}>
        <Grid container justifyContent='center' className={cardClassName}>
            <Grid item xs={12} className='GifterPageItemName'>
                {props.data.name}
            </Grid>
            <Grid item xs={10}>
                <img src={`${props.data.link}`} className='GifterPageItemImage'/>
            </Grid>
        </Grid>
    </Grid>)
}

interface ConfirmationComponentProps {
    userName: string;
    itemName: string

    confirm(): void

    reject(): void
}

function ConfirmationComponent(props: ConfirmationComponentProps) {
    // let gameState = props.gameState
    return (
        <div>
            <div className='GifterPageModalOverlay' onClick={props.reject}/>
            <div className='GifterModalContainer'>
                <Grid container justifyContent='center'>
                    <Grid item xs={10}>
                        ARE YOU SURE ABOUT THAT!?
                    </Grid>
                </Grid>
                <Grid container justifyContent='center' className='GifterModalDetails'>
                    <Grid item xs={10}>
                        Ты действительно хочешь отдать <b>"{props.itemName}"</b> питуху по имени <b>"{props.userName}"</b>
                    </Grid>
                </Grid>
                <Grid container justifyContent='center' className='GifterModalButtonBlock'>
                    <Grid item xs={6}>
                        <Button variant='contained' color='success' onClick={props.confirm}>Бля да, заебал</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant='contained' color='warning' onClick={props.reject}>Не, нахуй</Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

interface GameState {
    items: Map<string, { data: NamedImage, isSelected: boolean }>
    users: Map<string, { data: NamedImage, isSelected: boolean }>
}

function initialiseGameState(extItems: NamedImage[], extUsers: NamedImage[]): GameState {
    let items = new Map<string, { data: NamedImage, isSelected: boolean }>()
    let users = new Map<string, { data: NamedImage, isSelected: boolean }>()
    extUsers.forEach(it => users.set(it.id, {data: it, isSelected: false}))
    extItems.forEach(it => items.set(it.id, {data: it, isSelected: false}))
    return {items: items, users: users}
}

function copyGameState(gameState: GameState) {
    let items = new Map<string, { data: NamedImage, isSelected: boolean }>()
    let users = new Map<string, { data: NamedImage, isSelected: boolean }>()
    gameState.users.forEach(it => users.set(it.data.id, {data: it.data, isSelected: it.isSelected}))
    gameState.items.forEach(it => items.set(it.data.id, {data: it.data, isSelected: it.isSelected}))
    return {items: items, users: users}
}

function selectCard(id: string, cards: Map<string, { data: NamedImage, isSelected: boolean }>) {
    cards.forEach((value, key) => {
        if (value.isSelected && key !== id)
            value.isSelected = false
        if (key === id)
            value.isSelected = true
    })
}

function hasSelectedCard(cards: Map<string, { data: NamedImage, isSelected: boolean }>): boolean {
    let hasSelected = false
    cards.forEach((value, key) => {
        if (value.isSelected)
            hasSelected = true
    })
    return hasSelected
}

function clearSelection(cards: Map<string, { data: NamedImage, isSelected: boolean }>) {
    cards.forEach((value, key) => {
        value.isSelected = false
    })
}

function getSelectedCard(cards: Map<string, { data: NamedImage, isSelected: boolean }>): NamedImage | undefined {
    let selected = undefined
    cards.forEach((value, key) => {
        if (value.isSelected)
            selected = value.data
    })
    return selected
}

function GifterPage() {

    const [isInitialised, setInitialised] = useState(false)
    const [gameStateImmutable, setGameState] = useState(initialiseGameState([] as NamedImage[], [] as NamedImage[]))
    const [availableUsers, setAvailableUsers] = useState<NamedImage[]>([] as NamedImage[])
    const [items, setItems] = useState<NamedImage[]>([] as NamedImage[])
    const gameState = copyGameState(gameStateImmutable)

    useEffect(() => {
        if (!isInitialised) {
            getItems().then((itemsResponse) => {
                getAvailableUsers().then((usersResponse) => {
                    setInitialised(true)
                    setGameState(initialiseGameState(itemsResponse, usersResponse))
                    setAvailableUsers(usersResponse)
                    setItems(itemsResponse)
                })
            })
        }
    })

    const bothSelected = hasSelectedCard(gameState.items) && hasSelectedCard(gameState.users)
    let confirmationComponent = <div/>
    if (bothSelected)
        confirmationComponent = <ConfirmationComponent
            userName={getSelectedCard(gameState.users)!!.name}
            itemName={getSelectedCard(gameState.items)!!.name}
            confirm={() => {
                grant(getSelectedCard(gameState.users)!!.id, getSelectedCard(gameState.items)!!.id);
                setInitialised(false)
            }}
            reject={() => {
                clearSelection(gameState.items);
                setGameState(gameState)
            }}/>


    let itemComponents = items.map((item) => (<GiftItemCard key={item.id}
                                                            data={item}
                                                            isSelected={gameState.items.get(item.id)?.isSelected ?? false}
                                                            onClick={() => {
                                                                selectCard(item.id, gameState.items);
                                                                setGameState(gameState)
                                                            }}
    />))
    let userComponents = availableUsers.map((user) => (<UserCard key={user.id}
                                                                 data={user}
                                                                 isSelected={gameState.users.get(user.id)?.isSelected ?? false}
                                                                 onClick={() => {
                                                                     selectCard(user.id, gameState.users);
                                                                     setGameState(gameState)
                                                                 }}
    />))

    return (<div>
        {confirmationComponent}
        <div className='GifterPagePadding'/>
        <Grid container justifyContent='center'>
            <Grid item xs={8} className='GifterPageGreeting'>
                <div>Здравствуйте, {localStorage.getItem('name')}.</div>
                <div>Надо выбрать подарки питухам</div>
            </Grid>
            <Grid container justifyContent='center'>
                <Grid item xs={6}>
                    <Grid container justifyContent='center'>
                        <Grid item xs={11}>
                            <div className='GifterPageColumnHeader'>Питухи</div>
                        </Grid>
                        {userComponents}
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container justifyContent='center'>
                        <Grid item xs={11}>
                            <div className='GifterPageColumnHeader'>Подарки</div>
                        </Grid>
                        {itemComponents}
                    </Grid>
                </Grid>
            </Grid>
            <Grid container justifyContent='center' className='GifterPageLinkToGifts'>
                <Link to='/ny2022/meinkampf'>Можно глянуть, какого говна тебе навыбирали</Link>
            </Grid>
        </Grid>

    </div>)
}

export default GifterPage