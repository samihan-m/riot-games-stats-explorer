import { TextField, MenuItem, Stack, Box } from '@mui/material';
import { LolPlatform, LolPlatformValues } from '@/models/Platform';
import React, { useState } from 'react';

type SummonerSearchProps = {
    searchBarWidthOverride?: string;
}

export default function SummonerSearch(props: SummonerSearchProps) {
    const [summonerName, setSummonerName] = useState<string>("");
    const [platform, setPlatform] = useState<LolPlatform>(LolPlatformValues.na1);

    // Get the width of the search bar
    let searchBarWidth = "40%";
    if(props.searchBarWidthOverride) {
        searchBarWidth = props.searchBarWidthOverride;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent | React.MouseEvent) {
        event.preventDefault();

        // If the user didn't enter a name, take them to the root page for the platform they selected
        if(summonerName.length <= 0) {
            const newRoute = `/lol/${platform}`;
            window.location.href = window.origin + newRoute;
            return;
        }

        // Make sure there aren't any /'s in the summoner name
        if(summonerName.includes("/")) {
            alert("Please enter a valid summoner name.");
            return;
        }

        const newRoute = `/lol/${platform}/${summonerName}`;
        window.location.href = window.origin + newRoute;
        return;
    }

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Stack direction="row" spacing={1}>
                    <TextField
                        className=""
                        id="summoner-name"
                        label="LoL Name"
                        value={summonerName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setSummonerName(event.target.value);
                        }}
                        onKeyDown={(e) => {
                            if(e.key === "Enter") {
                                handleSubmit(e);
                            }
                        }}
                        sx={
                            {
                                '& .MuiInputBase-root': {
                                    color: 'white',
                                },
                                '& label.Mui-focused': {
                                    color: 'white',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: 'white',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                '& .MuiFormLabel-root': {
                                    color: 'white',
                                },
                                width: searchBarWidth,
                            }
                        }
                    />
                    <TextField
                        className=""
                        required
                        select
                        label="Region"
                        value={platform}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setPlatform(event.target.value as LolPlatform);
                        }}
                        sx={
                            {
                                '& .MuiInputBase-root': {
                                    color: 'white',
                                },
                                '& label.Mui-focused': {
                                    color: 'white',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: 'white',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                                '& .MuiFormLabel-root': {
                                    color: 'white',
                                },
                                '& .MuiSelect-icon': {
                                    color: 'white',
                                },
                            }
                        }
                    >
                        {
                            Object.keys(LolPlatformValues).map((value) => {
                                return <MenuItem key={value} value={value}>{value}</MenuItem>
                            })
                        }
                    </TextField>
                    <a className="bg-slate-600 hover:bg-blue-500 underline rounded px-4 py-4 text-white font-medium ml-8 hover:cursor-pointer" onClick={handleSubmit}>
                        Search
                    </a>
                </Stack>
            </form>
        </Box>
    )
}