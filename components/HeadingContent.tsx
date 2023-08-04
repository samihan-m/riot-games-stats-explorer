import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import SummonerSearch from './common/SummonerSearch';
import Image from 'next/image';
import ValorantSearch from './common/ValorantSearch';
import { Stack, Grid, Paper, Tooltip } from '@mui/material';

export default function HeadingContent() {

    return (
        <Box className="bg-black sticky z-50 top-0 h-1/6" sx={{paddingBottom: "1rem"}}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Paper elevation={12} sx={{ backgroundColor: "black" }}>
                        <Box sx={{ paddingLeft: "2rem" }}>
                            <Typography variant="h3" sx={{color: "white"}}>
                                <Link href="/" className="hover:underline">Stats Explorer</Link>
                            </Typography>
                            {/* <Link className="text-3xl font-bold underline text-white" href="/">Stats Explorer</Link> */}
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper elevation={12} sx={{ backgroundColor: "black" }}>
                        <Stack direction="row" id="lol-stuff">
                            <Link href="/lol" className="rounded bg-slate-800 hover:bg-blue-500 border-2 border-yellow-600">
                                <Box sx={{ position: 'relative', width: "3.5rem", height: "3.5rem" }}>
                                    <Tooltip title="All LoL Regions" arrow>
                                        <Image src="/lol-logo.png" alt="" fill />
                                    </Tooltip>
                                </Box>
                            </Link>
                            <Box sx={{paddingLeft: "2rem"}}>
                                <SummonerSearch />
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper elevation={12} sx={{ backgroundColor: "black" }}>
                        <Stack direction="row" id="val-stuff">
                            <Link href="#" className="rounded hover:cursor-not-allowed grayscale border-2 border-red-600">
                                <Box sx={{ position: 'relative', width: "3.5rem", height: "3.5rem" }}>
                                    <Tooltip title="All Valo Regions" arrow>
                                        <Image src="/valorant-logo.png" alt="" fill/>
                                    </Tooltip>
                                </Box>
                            </Link>
                            <Box sx={{paddingLeft: "2rem"}}>
                                <ValorantSearch />
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )

}