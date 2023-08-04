import { TextField, MenuItem, Button, Stack, Box } from '@mui/material';
import { Platform, PlatformValues } from '@/models/Platform';
import React, { useState } from 'react';

export default function ValorantSearch() {
    const [valorantName, setValorantName] = useState<string>("");
    const [platform, setPlatform] = useState<Platform>(PlatformValues.na1);

    function handleSubmit(event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent | React.MouseEvent) {
        event.preventDefault();

        // TODO: Once I get access to Valorant stuff, make sure this works
        alert("This feature is not yet available.")
        return; 
    }

    return (
        <Box>
            <form className="" onSubmit={handleSubmit}>
                <Stack direction="row" spacing={1}>
                    <TextField
                        className=""
                        required
                        id="valorant-name"
                        label="Valorant Name"
                        value={valorantName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setValorantName(event.target.value);
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
                                width: "40%",
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
                            setPlatform(event.target.value as Platform);
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
                            Object.keys(PlatformValues).map((value) => {
                                return <MenuItem key={value} value={value}>{value}</MenuItem>
                            })
                        }
                    </TextField>
                    <a className="hover:bg-blue-500 underline rounded px-4 py-4 text-white bg-slate-800 font-medium ml-8 hover:cursor-pointer" onClick={handleSubmit}>
                        Search
                    </a>
                </Stack>
            </form>
        </Box>
    )
}