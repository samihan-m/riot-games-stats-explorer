import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import SummonerSearch from './common/SummonerSearch';
import Image from 'next/image';
import ValorantSearch from './common/ValorantSearch';

export default function HeadingContent() {

    return (
        <Box className="h-1/6 bg-black sticky z-50 top-0">
            <div className="flex flex-row">
                <div className="pt-6">
                    <Link className="hover:underline px-4 pt-2 text-white my-4 ml-8 text-3xl font-bold" href="/">Stats Explorer</Link>
                </div>
                <div className="ml-8">
                    <Link href="/lol">
                        <Image src="/lol-logo.png" alt="" width={50} height={50} className="pt-4"/>
                    </Link>
                </div>
                <div className="my-4 py-4">
                    <Link className="hover:bg-blue-500 underline rounded px-4 py-4 text-white bg-slate-800 font-medium ml-8" href="/lol">All LoL Regions</Link>
                </div>
                <div className="pl-6">
                    <SummonerSearch />
                </div>
                <div className="ml-24">
                    <Link href="#">
                        <Image src="/valorant-logo.png" alt="" width={50} height={50} className="pt-4"/>
                    </Link>
                </div>
                <div className="my-4 py-4">
                    <Link className="rounded px-4 py-4 text-gray-500 bg-slate-800 font-medium ml-8 pointer-events-none" href="#" aria-disabled>All Valorant Regions (NYI)</Link>
                </div>
                <div className="pl-6">
                    <ValorantSearch />
                </div>
            </div>
        </Box>
    )

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
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="hover:bg-blue-500 underline rounded px-4 py-2 text-white bg-slate-800 font-medium">
                            All LoL Regions
                        </Typography>
                    </Link>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {/* this element is to add space between the button below and the previous link element above */}
                    </Typography>
                    <SummonerSearch />
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
            <Toolbar />
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