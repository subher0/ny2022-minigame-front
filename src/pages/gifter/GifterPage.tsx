import React, {useEffect, useState} from "react";
import './GifterPage.css'
import {FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import {NamedImage} from "../Models";
import {getAvailableUsers, getItems, grant} from "../../api/Api";
import {Link} from "react-router-dom";

interface GiftItemProps {
    item: NamedImage
    userList: NamedImage[]

    onValueSelected(userName: string, itemName: string): Promise<void>
}

function GiftItem(props: GiftItemProps) {
    let nameItems = props.userList.map((user) => (<MenuItem key={user.name} value={user.name}>{user.name}</MenuItem>))

    const [currentItem, setCurrentItem] = useState<string>('')

    return (
        <Grid item xs={11} lg={4}>
            <Grid container justifyContent='center' className='GifterPageItem'>
                <Grid item xs={6} className='GifterPageItemName'>
                    {props.item.name}
                </Grid>
                <Grid item xs={10}>
                    <img src={`${props.item.image}`} className='GifterPageItemImage'/>
                </Grid>
                <Grid item xs={8}>
                    <Grid container justifyContent='center' className='GifterPageItemUserSelect'>
                        <FormControl fullWidth>
                            <InputLabel id="select-label">КОМУ!?!1?</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentItem}
                                disabled={currentItem !== ''}
                                label="КОМУ!?!1?"
                                onChange={(event) => {
                                    setCurrentItem(event.target.value)
                                    if (event.target.value != null)
                                        props.onValueSelected(event.target.value, props.item.name)
                                            .catch(() => setCurrentItem(''))
                                }}
                            >
                                {nameItems}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

function topLevelComponent(isInitialised: boolean, availableUsers: NamedImage[],
                           items: NamedImage[], setInitialised: Function) {
    let itemComponents = items.map((item) => (<GiftItem key={item.name} item={item}
                                                        userList={availableUsers}
                                                        onValueSelected={(userName, itemName) => {
                                                            setInitialised(false)
                                                            return grant(itemName, userName)
                                                                .then(response => {
                                                                    return response
                                                                })
                                                                .finally(() => setInitialised(true))
                                                        }}/>))
    return (<div>
        <div className='GifterPagePadding'/>
        <Grid container justifyContent='center'>
            <Grid item xs={8} className='GifterPageGreeting'>
                <div>Здравствуйте, {localStorage.getItem('name')}.</div>
                <div>Надо выбрать подарки питухам</div>
            </Grid>
            <Grid container justifyContent='center'>
                {itemComponents}
            </Grid>
            <Grid container justifyContent='center' className='GifterPageLinkToGifts'>
                <Link to='/ny2022/meinkampf'>Можно глянуть, какого говна тебе навыбирали</Link>
            </Grid>
        </Grid>

    </div>)
}

function GifterPage() {

    const [isInitialised, setInitialised] = useState(false)
    const [availableUsers, setAvailableUsers] = useState<NamedImage[]>([] as NamedImage[])
    const [items, setItems] = useState<NamedImage[]>([] as NamedImage[])
    const component = topLevelComponent(isInitialised, availableUsers, items, setInitialised)

    useEffect(() => {
        if (!isInitialised) {
            getItems().then((itemsResponse) => {
                getAvailableUsers().then((usersResponse) => {
                    setInitialised(true)
                    setAvailableUsers(usersResponse)
                    setItems(itemsResponse)
                })
            })
        }
    })

    return (<div>
        {component}
    </div>)
}

export default GifterPage