import { TextField, MenuItem, Stack, Box } from '@mui/material';
import { ValPlatform, ValPlatformValues } from '@/models/Platform';
import React, { useState } from 'react';

type ValorantPlayerSearchProps = {
    searchBarWidthOverride?: string;
}

export default function ValorantPlayerSearch(props: ValorantPlayerSearchProps) {
    const [riotId, setRiotId] = useState<string>("");
    const [platform, setPlatform] = useState<ValPlatform>(ValPlatformValues.na);

    // Get the width of the search bar
    let searchBarWidth = "40%";
    if(props.searchBarWidthOverride) {
        searchBarWidth = props.searchBarWidthOverride;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent | React.MouseEvent) {
        event.preventDefault();

        // If the user didn't enter a name, take them to the root page for the platform they selected
        if(riotId.length <= 0) {
            const newRoute = `/val/${platform}`;
            window.location.href = window.origin + newRoute;
            return;
        }
        
        // Make sure there aren't any /'s in the riot id
        if(riotId.includes("/")) {
            alert("Please enter a valid Riot ID.");
            return;
        }

        // Make sure the user entered a valid riot id
        const riotIdRegex = /^(.{3,16})#(.{3,5})$/ //Matches any string with 3-16 characters, followed by a #, followed by 3-5 characters
        if(riotIdRegex.test(riotId) === false) {
            alert("Please enter a valid Valorant name and tag.");
            return;
        }

        const [gameName, tagLine] = riotId.split("#");
        const newRoute = `/val/${platform}/${gameName}/${tagLine}`;
        window.location.href = window.origin + newRoute;
        return;
    }

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Stack direction="row" spacing={1}>
                    <TextField
                        id="riot-id"
                        label="Val Name#Tag"
                        value={riotId}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setRiotId(event.target.value);
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
                        select
                        label="Region"
                        value={platform}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setPlatform(event.target.value as ValPlatform);
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
                                width: "25%",
                            }
                        }
                    >
                        {
                            Object.keys(ValPlatformValues).map((value) => {
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