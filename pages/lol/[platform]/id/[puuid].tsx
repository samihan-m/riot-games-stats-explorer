// If we reach this page, we need to
// 1. Get the puuid from the URL
// 2. Get the player document from the database
// 3. Call the LolPlayerPage function to render the page with the player document
// The LolPlayerPage already has some code in it to change the URL to the latest version of the player's summoner name, so we don't need to change the URL here

import { GetServerSideProps } from "next";
import { Player } from "@/models/Player";
import { RequestError } from "@/models/Error";
import getConfig from "next/config";
import LolPlayerPage, { LolPlayerPageProps } from "../[summonerName]";


const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;


export default function LolPlayerByPuuidPage(props: LolPlayerPageProps) {
    return LolPlayerPage(props);
}

export const getServerSideProps: GetServerSideProps<LolPlayerPageProps> = async (context) => {
    let props: LolPlayerPageProps = {
        playerData: null,
    }

    const { platform, puuid } = context.query;
    const playerInfoEndpointUrl = `${apiUrl}/lol/summoner/${platform}/id/${puuid}`;
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