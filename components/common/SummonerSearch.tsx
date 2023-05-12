import { TextField, MenuItem, Button, Stack, Box } from '@mui/material';
import { Platform, PlatformValues } from '@/models/Platform';
import React, { useState } from 'react';

export default function SummonerSearch() {
    const [summonerName, setSummonerName] = useState<string>("");
    const [platform, setPlatform] = useState<Platform>(PlatformValues.na1);

    function handleSubmit(event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent) {
        event.preventDefault();

        if(summonerName.length <= 0) {
            return;
        }

        const newRoute = `/lol/${platform}/${summonerName}`;
        window.location.href = window.origin + newRoute;
    }

    return (
        <Box className="summoner-search-container">
            <form className="summoner-search-form" onSubmit={handleSubmit}>
                <Stack direction={"row"} spacing={3}>
                    <TextField
                        className=""
                        required
                        id="outlined-required"
                        label="Summoner Name"
                        value={summonerName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setSummonerName(event.target.value);
                        }}
                        onKeyDown={(e) => {
                            if(e.key === "Enter") {
                                handleSubmit(e);
                            }
                        }}
                    />
                    <TextField
                        className=""
                        required
                        select
                        label="Region"
                        value={platform}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setPlatform(event.target.value as Platform);
                        }}
                    >
                        {
                            Object.keys(PlatformValues).map((value) => {
                                return <MenuItem key={value} value={value}>{value}</MenuItem>
                            })
                        }
                    </TextField>
                    <Button
                        className=""
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Search
                    </Button>
                </Stack>
            </form>
        </Box>
    )
}