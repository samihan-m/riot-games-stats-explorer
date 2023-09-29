import CustomHeadLayout from "@/components/common/CustomHeadLayout";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState, useRef } from "react";
import { Player } from "@/models/Player";
import { RequestError } from "@/models/Error";
import { GetServerSideProps } from "next";
import { LolMatch } from "@/models/lol/LolMatch";
import getConfig from "next/config";
import { Stack, Typography } from '@mui/material';
import CircularProgress from "@mui/material/CircularProgress";
import SummonerProfile from "@/components/common/SummonerProfile";
import CustomFooter from "@/components/common/CustomFooter";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

export type LolPlayerPageProps = {
    playerData: Player | null,
    error?: RequestError,
}

export default function LolPlayerPage(props: LolPlayerPageProps) {
    const [player, setPlayer] = useState<Player | null>(props.playerData);
    const [lolMatches, setLolMatches] = useState<LolMatch[] | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDownloadingMatches, setIsDownloadingMatches] = useState<boolean>(false);
    const router = useRouter();
    let paramSummonerName = useRef("");

    const downloadLolMatches = useCallback(async (platform: string, puuid: string) => {
        setIsDownloadingMatches(true);

        let playerData = player as Player;
        if (playerData["lol_name"] === null) {
            // If the player doesn't have a lol_name initialized, we know none of their lol stats are initialized
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
        if(router.isReady === false) {
            // On initial page load, the router.query object will be empty for a tiny bit.
            // This is to prevent the page from loading without the appropriate info from the query object.
            // See https://github.com/vercel/next.js/discussions/12661#discussioncomment-360764
            return;
        }

        if (player === null) {
            return;
        }

        let queryParams = router.query as {platform: string, summonerName: string};
        paramSummonerName.current = queryParams.summonerName;

        let playerData = player as Player;

        const puuid = playerData._id;
        const latestSummonerName = playerData.lol_name;
        const latestPlatform = playerData.platform;

        if (latestSummonerName !== null && latestSummonerName != paramSummonerName.current) {
            // Update the URL to the properly formatted summoner name without causing a reload
            // router.push(`/lol/${platform}/${latestSummonerName}`, undefined, { shallow: true });
            // Note: I think the profile refreshes anyway because what shallow routing does is remove the requirement of calling getServerSideProps again,
            // but it still makes the React components re-render (this includes the code that downloads all of the matches from the database)

            // This doesn't cause a rerender!
            window.history.replaceState({}, "", `/lol/${latestPlatform}/${latestSummonerName}`);
        }

        if (player["lol_name"] === null) {
            updatePlayerData();
            return;
        }

        downloadLolMatches(latestPlatform, puuid);

    }, [player, downloadLolMatches, updatePlayerData, router.isReady, router.query])

    const doDisplayErrorContent = props.error !== undefined;
    const errorMessage = props.error?.detail as string;

    // Get the summoner name to display in the page title - either the one from the database (preferrably this one) or the one from the URL
    const summonerDisplayName = player?.lol_name === undefined ? paramSummonerName : player.lol_name;

    return (
        <CustomHeadLayout title={`${summonerDisplayName}'s LoL Stats`} description={`LoL Stats for ${summonerDisplayName} in <insert current year here>`}>
            {isDownloadingMatches === true &&
                <Stack alignItems="center" spacing={8}>
                    <CircularProgress></CircularProgress>
                    <Typography variant="subtitle1" align="center">
                        Downloading matches...
                    </Typography>
                </Stack>
            }
            {isDownloadingMatches === false &&
                <SummonerProfile
                    searchedSummonerName={paramSummonerName.current}
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