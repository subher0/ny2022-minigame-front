import React, {MouseEvent, useState} from "react";
import './LoginPage.css';
import {Button, Grid, TextField} from "@mui/material";
import {login} from "../../api/Api";

interface LoginPageProps {
    onLogin(name: string, userId: string): void
}

function LoginPage(props: LoginPageProps) {
    const [id, setId] = useState('')

    function onLoginClick() {
        login(id)
            .then((name) => props.onLogin(name, id))
    }

    return (
        <div className='LoginPageContainer'>
            <div className='LoginPagePadding'/>
            <div className=''>
                <Grid container justifyContent='center'>
                    <Grid item xs={8} className='LoginPageGreeting'>
                        Dickpicker
                    </Grid>
                </Grid>
                <Grid container justifyContent='center'>
                    <Grid item xs={8} className='LoginPageTextField'>
                        <TextField className='LoginPageNumbersField' label='Введи кусок говна сюда' onChange={
                            (event) => setId(event.target.value)}/>
                    </Grid>
                </Grid>
                <Grid container justifyContent='center'>
                    <Grid item xs={8} className=''>
                        <Button variant='contained' color='success' className='LoginPageButton' onClick={onLoginClick}>ОК</Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default LoginPage;