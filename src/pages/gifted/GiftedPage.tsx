import React, {useEffect, useState} from "react";
import './GiftedPage.css'
import {Grid} from "@mui/material";
import {NamedImage} from "../Models";
import {getGiftedItems} from "../../api/Api";
import {Link} from "react-router-dom";

interface GiftItemProps {
    item: NamedImage
}

function GiftItem(props: GiftItemProps) {
    return (
        <Grid item xs={11} lg={4}>
            <Grid container justifyContent='center' className='GiftedPageItem'>
                <Grid item xs={6} className='GiftedPageItemName'>
                    {props.item.name}
                </Grid>
                <Grid item xs={10}>
                    <img src={`${props.item.image}`} className='GiftedPageItemImage'/>
                </Grid>
            </Grid>
        </Grid>
    )
}

function topLevelComponent(isInitialised: boolean, items: NamedImage[]) {
    let itemComponents = items.map((item) => (<GiftItem key={item.name} item={item}/>))
    return (<div>
        <div className='GiftedPagePadding'/>
        <Grid container justifyContent='center'>
            <Grid item xs={8} className='GiftedPageGreeting'>
                <div>Здравствуйте, {localStorage.getItem('name')}.</div>
                <div>Поздравляю, вы питух и вот що вам надарили</div>
            </Grid>
            <Grid container justifyContent='center'>
                {itemComponents}
            </Grid>
            <Grid container justifyContent='center' className='GiftedPageLinkToGifts'>
                <Link to='/ny2022'>Можно пойти дарить говно другим</Link>
            </Grid>
        </Grid>

    </div>)
}

function GiftedPage() {

    const [isInitialised, setInitialised] = useState(false)
    const [items, setItems] = useState<NamedImage[]>([] as NamedImage[])
    const component = topLevelComponent(isInitialised, items)

    useEffect(() => {
        if (!isInitialised) {
            getGiftedItems().then((itemsResponse) => {
                setInitialised(true);
                setItems(itemsResponse);
            })
        }
    })

    return (<div>
        {component}
    </div>)
}

export default GiftedPage