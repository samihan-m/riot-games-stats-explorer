import CustomHeadLayout from "@/components/common/CustomHeadLayout";
import { useRouter } from "next/router";
import usePush from "@/utility/usePush";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Player } from "@/models/Player";
import { RequestError } from "@/models/Error";
import { GetServerSideProps } from "next";
import { LolMatch } from "@/models/LolMatch";
import getConfig from "next/config";
import SummonerSearch from "@/components/common/SummonerSearch";
import { TextField, MenuItem, Button, Stack, Box, Typography } from '@mui/material';
import CircularProgress from "@mui/material/CircularProgress";
import SummonerProfile from "@/components/common/SummonerProfile";
import CustomFooter from "@/components/common/CustomFooter";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

// import useSWR, { SWRResponse, Fetcher } from "swr";
// function usePlayer(platform: string, summonerName: string) {
//     const playerInfoEndpointUrl = `${apiUrl}/lol/summoner/${platform}/${summonerName}`
//     const fetcher: Fetcher<Player, string> = async () => {
//         const res = await fetch(playerInfoEndpointUrl);
//         const resJson = await res.json();
//         if(res.ok === false) {
//             console.log(res.status)
//             if(res.status === 422) {
//                 // Invalid region
//             }
//             else if(res.status === 404) {
//                 // No summoner with that name in the specified region
//             }
//             throw new Error(resJson["detail"])
//         }
//         return resJson as Player;
//     };
//     const {data, error, isLoading} = useSWR(playerInfoEndpointUrl, fetcher);

//     return {
//         summoner: data,
//         isLoading,
//         isError: error
//     };
// }

type LolPlayerPageProps = {
    playerData: Player | null,
    error?: RequestError,
}

export default function LolPlayerPage(props: LolPlayerPageProps) {
    const [player, setPlayer] = useState<Player | null>(props.playerData);
    const [lolMatches, setLolMatches] = useState<LolMatch[] | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDownloadingMatches, setIsDownloadingMatches] = useState<boolean>(false);
    const router = useRouter();
    let { platform, summonerName } = router.query;
    const push = usePush();

    platform = platform as string;
    summonerName = summonerName as string;

    const downloadLolMatches = useCallback(async (platform: string, puuid: string) => {
        setIsDownloadingMatches(true);

        let playerData = player as Player;
        if (playerData["lol_name"] === null) {
            // If the player doesn't have a lol_name initialized, we know we don't have the entirety of their lol stats initialized
            // (No matches to download)
            setIsDownloadingMatches(false);
            return;
        }

        let downloadedLolMatches: LolMatch[];

        const matchesEndpointUrl = `${apiUrl}/lol-matches/${platform}/${puuid}`;
        console.log(`Making request to download matches from ${matchesEndpointUrl}`)
        const res = await fetch(matchesEndpointUrl);
        console.log("Received response from server, awaiting .json() call..")
        downloadedLolMatches = await res.json();
        console.log("Done downloading.")

        // Sort matches by timestamp before storing them in state
        downloadedLolMatches.sort((a, b) => a["timestamp"] - b["timestamp"])

        setLolMatches(downloadedLolMatches);
        setIsDownloadingMatches(false);
    }, [player]);

    const updatePlayerData = useCallback(async () => {
        if (player === null) {
            return;
        }

        setIsUpdating(true);

        let playerData = player as Player;

        const puuid = playerData._id;
        const platform = playerData.platform;

        // Update player object
        const playerInfoEndpointUrl = `${apiUrl}/lol/summoner/${platform}/${puuid}/update`;
        const res = await fetch(playerInfoEndpointUrl);
        if (res.ok === false) {
            console.log(res.status);
            const errorData: RequestError = await res.json();
            // Possible values:
            // 429: The player has been updated recently, you'll have to wait a while before you can update them again
            // 422: Invalid platform
            // 404: No summoner with that name in the specified region
            // This shouldn't ever error unless the client messes with the URL intentionally, so I'm okay with not handling this that gracefully
            console.log(errorData);
            if (res.status === 429) {
                alert(errorData.detail);
            }
            else {
                alert(`Error updating player data: ${JSON.stringify(errorData)}`);
            }
        }
        else {
            const playerData: Player = await res.json();
            setPlayer(playerData);
        }

        // Fetch new matches
        await downloadLolMatches(platform, puuid);

        setIsUpdating(false);
    }, [player, downloadLolMatches]);

    useEffect(() => {
        if (player === null) {
            return;
        }

        let playerData = player as Player;

        const puuid = playerData._id;
        const latestSummonerName = playerData.lol_name;
        const platform = playerData.platform;

        if (latestSummonerName !== null && latestSummonerName != summonerName) {
            // Update the URL to the properly formatted summoner name without causing a reload
            push(`/lol/${platform}/${latestSummonerName}`, undefined, { shallow: true });
            // Note: I think a reload happens anyway because I don't think you can change the value of a non-query parameter without causing a reload
        }

        if (player["lol_name"] === null) {
            updatePlayerData();
            return;
        }

        downloadLolMatches(platform, puuid);

    }, [player, summonerName, push, downloadLolMatches, updatePlayerData])

    const profilePictureUrl = `https://raw.communitydragon.org/latest/game/assets/ux/summonericons/profileicon${player?.lol_profile_icon_id}.png`;

    const doDisplayErrorContent = props.error !== undefined;
    const errorMessage = props.error?.detail as string;

    return (
        <CustomHeadLayout title={`${summonerName}'s LoL Stats`} description={`LoL Stats for ${summonerName} in <insert current year here>`}>
            {isDownloadingMatches === true &&
                <>
                    <div className="center-form">
                        <CircularProgress></CircularProgress>
                    </div>
                    <Typography variant="subtitle1" align="center">
                        Downloading matches...
                    </Typography>
                </>
            }
            {isDownloadingMatches === false &&
                <SummonerProfile
                    searchedSummonerName={summonerName}
                    playerData={player}
                    lolMatches={lolMatches}
                    updatePlayerDataCallback={updatePlayerData}
                    isCurrentlyUpdating={isUpdating}
                />
            }
            {doDisplayErrorContent &&
                <Stack direction={"column"} spacing={1} className="summoner-search-error-messages-container">
                    {errorMessage + " "} {/* Adding a space here because otherwise the error message and the following line have no space in between.*/}
                    Try searching for a different name or on a different region.
                </Stack>
            }
            {/* <h1>{platform} - {player === null ? summonerName : player.lol_name === null ? summonerName : player.lol_name}</h1>
            {player &&
                <>
                    {player.lol_profile_icon_id &&
                        <div className="profile-icon-container">
                            <Image
                                src={profilePictureUrl}
                                alt="Profile picture"
                                fill
                                quality={100}
                            />
                        </div>
                    }
                    <h2>{player._id}</h2>
                    {lolMatches !== null &&
                        <h3>{lolMatches.length} matches downloaded (out of {player.lol_match_ids.length})</h3>
                    }
                    
                    <Button
                        className=""
                        variant="contained"
                        color="primary"
                        onClick={updatePlayerData}
                        disabled={isUpdating}
                    >
                        {isUpdating ? <CircularProgress/> : "Update Data" }
                    </Button>
                    To do list:
                    -1. Come up with overall design for site (i.e. sidebar? / topbar?) (to understand where the subcontent of each page will be loaded to)
                    0. Add a LoL player search page
                    1. Make the LoL player page look good + add error handling for when search errors (display an error message + the Search Summoner widget again)
                    + add update button
                    2. Add more widgets to the LoL player page
                </>
            }
            <SummonerSearch></SummonerSearch> */}
            <CustomFooter />
        </CustomHeadLayout>
    )
}

export const getServerSideProps: GetServerSideProps<LolPlayerPageProps> = async (context) => {
    let props: LolPlayerPageProps = {
        playerData: null,
    }

    const { platform, summonerName } = context.query;
    const playerInfoEndpointUrl = `${apiUrl}/lol/summoner/${platform}/${summonerName}`;
    const res = await fetch(playerInfoEndpointUrl);
    if (res.ok === false) {
        console.log(res.status);
        const errorData: RequestError = await res.json();
        // Possible values:
        // 422: Invalid platform
        // 404: No summoner with that name in the specified region
        props.error = errorData;
    }
    else {
        const playerData: Player = await res.json();
        props.playerData = playerData;
    }

    return {
        props
    }
}