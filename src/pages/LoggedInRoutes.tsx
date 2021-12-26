import {Route, Routes} from "react-router-dom";
import GifterPage from "./gifter/GifterPage";
import {Button, Grid} from "@mui/material";
import GiftedPage from "./gifted/GiftedPage";
import './LoggedInRoutes.css'

interface LoggedInRoutesProps {
    onExit(): void
}

function LoggedInRoutes(props: LoggedInRoutesProps) {
    return (
        <div>
            <Grid container justifyContent='center'>
                <Grid item xs={8}>
                    <Button className='LoggedInRoutedLogOutButton' variant='contained' color='warning' onClick={() => props.onExit()}>Я больше не участвую в этом дерьме</Button>
                </Grid>
            </Grid>
            <Routes>
                <Route path='/' element={<GifterPage/>}/>
                <Route path='/meinkampf' element={<GiftedPage/>}/>
            </Routes>
        </div>)
}

export default LoggedInRoutes