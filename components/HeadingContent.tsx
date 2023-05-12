import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import SummonerSearch from './common/SummonerSearch';

export default function HeadingContent() {
    
    
    return (
        <Box sx={{ flexGrow: 1 }} className="padding-bottom-3em">
            <AppBar className="position-fixed">
                <Toolbar>
                    {/* TODO: Make a real menu when I need to. */}
                {/* <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton> */}
                <Link className="navbar-link" href="/lol">
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        LoL
                    </Typography>
                </Link>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {/* this element is to add space between the button below and the previous link element above */}
                </Typography>
                <SummonerSearch/>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {/* this element is to add space between the button below and the previous link element above */}
                </Typography>
                {/* TODO: Replace this summoner search with a Valorant player search */}
                {/* <SummonerSearch/> */}
                {/* TODO: Make a real login system if I want to */}
                {/* <Button color="inherit">Login</Button> */}
                </Toolbar>
            </AppBar>
            {/* This toolbar below is necessary, believe it or not - without it, there isn't enough padding between the AppBar and the following content*/}
            <Toolbar/> 
        </Box>
        // <>
        // <div className="navbar navbar-items-container">
        //     <div className="navbar-item">
        //         Home
        //     </div>
        //     <div className="navbar-item">
        //         LoL
        //     </div>
        //     <div className="navbar-item">
        //         Valorant
        //     </div>
        // </div>
        // </>
    )
}