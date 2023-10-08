import CustomHeadLayout from "@/components/common/CustomHeadLayout";
import { useState, useCallback, useEffect, useRef } from "react";
import { RequestError } from "@/models/Error";
import { ValPlayer } from "@/models/val/ValPlayer";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import { Stack, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CustomFooter from "@/components/common/CustomFooter";
import { ValMatch } from "@/models/val/ValMatch";
// import ValorantProfile from "@/components/common/ValorantProfile";
import { useRouter } from "next/router";
import Link from "next/link";
import ValorantProfile from "@/components/common/ValorantProfile";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

export type ValPlayerPageProps = {
    playerData: ValPlayer | null,
    error?: RequestError,
}

export default function ValPlayerPage(props: ValPlayerPageProps) {
    const [player, setPlayer] = useState<ValPlayer | null>(props.playerData);
    const [valMatches, setValMatches] = useState<ValMatch[] | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDownloadingMatches, setIsDownloadingMatches] = useState<boolean>(false);

    const doDisplayErrorContent = props.error !== undefined;
    const errorMessage = props.error?.detail as string;

    const router = useRouter();
    const riotId = useRef("");
    // const riotId = `${gameName}#${tagLine}`;

    const downloadValMatches = useCallback(async (platform: string, puuid: string) => {
        setIsDownloadingMatches(true);

        let downloadedValMatches: ValMatch[];

        const matchesEndpointUrl = `${apiUrl}/val-matches/${platform}/${puuid}`;
        console.log(`Making request to download matches from ${matchesEndpointUrl}`);
        const res = await fetch(matchesEndpointUrl);
        console.log("Received response from server, awaiting .json() call..");
        downloadedValMatches = await res.json();
        console.log("Done downloading.");

        // Sort matches by timestamp before storing them in state
        downloadedValMatches.sort((a, b) => a.timestamp - b.timestamp);

        setValMatches(downloadedValMatches);
        setIsDownloadingMatches(false);
    }, []);

    const updatePlayerData = useCallback(async() => {
        if (player === null) {
            return;
        }

        let playerData = player as ValPlayer;
        let puuid = playerData._id;
        let platform = playerData.platform;

        setIsUpdating(true);
        const updatePlayerEndpointUrl = `${apiUrl}/val/player/${platform}/id/${puuid}/update`;
        const res = await fetch(updatePlayerEndpointUrl);
        if (res.ok === false) {
            console.log(res.status);
            const errorData: RequestError = await res.json();
            // Possible values:
            // 403: Forbidden (This account has not provided access to their stats)
            // 404: Player not found
            // 422: Invalid platform
            // 429: Rate limit exceeded - wait a bit before trying to update the player again
            console.log(errorData);
            if(res.status === 429) {
                alert(errorData.detail);
            }
            else {
                alert(`Error updating player data: ${JSON.stringify(errorData)}`)
            }
            setIsUpdating(false);
            return;
        }
        const updatedPlayerData: ValPlayer = await res.json();
        setPlayer(updatedPlayerData);

        // Re-fetch matches
        await downloadValMatches(updatedPlayerData.platform, updatedPlayerData._id);
        setIsUpdating(false);

    }, [player, downloadValMatches]);

    useEffect(() => {
        if(router.isReady === false) {
            // On initial page load, the router.query object will be empty for a tiny bit.
            // This is to prevent the page from loading without the appropriate info from the query object.
            // See https://github.com/vercel/next.js/discussions/12661#discussioncomment-360764
            return;
        }
        
        if (player === null) {
            return;
        }

        const { platform, gameName, tagLine } = router.query as { platform: string, gameName: string, tagLine: string };
        riotId.current = `${gameName}#${tagLine}`;

        let playerData = player as ValPlayer;
        const puuid = playerData._id;
        const latestGameName = playerData.game_name;
        const latestTagLine = playerData.tag_line;
        const latestPlatform = playerData.platform;

        if(latestPlatform !== platform || latestGameName !== gameName || latestTagLine !== tagLine) {
            // The player data we used to navigate here is outdated, so we need to update the URL
            window.history.replaceState({}, "", `/val/${latestPlatform}/${latestGameName}/${latestTagLine}`);
        }

        downloadValMatches(latestPlatform, puuid);

    }, [player, downloadValMatches, router.isReady, router.query]);

    return (
        <CustomHeadLayout title={`${riotId.current}'s Valorant Stats`} description={`Valorant Stats for ${riotId.current} in <insert current year here>`}>
            {isDownloadingMatches === true &&
                <Stack alignItems="center" spacing={8}>
                    <CircularProgress></CircularProgress>
                    <Typography variant="subtitle1" align="center">
                        Downloading matches...
                    </Typography>
                </Stack>
            }
            {isDownloadingMatches === false &&
                <Stack spacing={4} alignItems={"center"}>
                    <ValorantProfile
                        searchedRiotId={riotId.current}
                        playerData={player}
                        valMatches={valMatches}
                        updatePlayerDataCallback={updatePlayerData}
                        isCurrentlyUpdating={isUpdating}
                    />
                </Stack>
            }
            {doDisplayErrorContent &&
                <Stack direction={"column"} spacing={1} className="text-red-600">
                    <Typography variant="subtitle1" align="center">
                        {errorMessage + " "} {/* Adding a space here because otherwise the error message and the following line have no space in between.*/}
                        <br/>
                        Try searching for a different name or on a different region.
                    </Typography>
                    <Typography variant="h6" align="center" className="text-white">
                        {"If this is you and you want to view your stats, feel free to give us access by signing in with your Riot ID."}
                    </Typography>
                    <Link href="/riot-sign-on" className="mt-2 self-center text-xl bg-red-600 border-4 border-red-700 rounded-md pt-4 pb-4 pl-8 pr-8 text-white underline decoration-white hover:bg-red-500 hover:border-red-600">Sign in with Riot ID</Link>
                </Stack>
            }
            <CustomFooter />  
        </CustomHeadLayout>
        
    )
}

export const getServerSideProps: GetServerSideProps<ValPlayerPageProps> = async (context) => {
    let props: ValPlayerPageProps = {
        playerData: null
    }

    const { platform, gameName, tagLine } = context.params as { platform: string, gameName: string, tagLine: string };
    // The riotId only contains the name, not the tagline, so we need to get that
    const playerInfoEndpointUrl = `${apiUrl}/val/player/${platform}/${gameName}/${tagLine}`;
    const res = await fetch(playerInfoEndpointUrl);
    if(res.ok === false) {
        console.log(res.status);
        const errorData: RequestError = await res.json();
        // Possible values:
        // 400: Bad request (riotId is invalid)
        // 404: Player not found
        // 422: Invalid platform
        props.error = errorData;
    }
    else {
        const playerData: ValPlayer = await res.json();
        props.playerData = playerData;
    }
    
    return {
        props
    }
}