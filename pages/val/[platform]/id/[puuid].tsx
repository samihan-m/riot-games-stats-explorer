import { GetServerSideProps } from "next";
import ValPlayerPage, { ValPlayerPageProps } from "../[gameName]/[tagLine]";
import getConfig from "next/config";
import { RequestError } from "@/models/Error";
import { ValPlayer } from "@/models/val/ValPlayer";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

export default function ValPlayerByPuuidPage(props: ValPlayerPageProps) {
    return ValPlayerPage(props);
}

export const getServerSideProps: GetServerSideProps<ValPlayerPageProps> = async (context) => {
    let props: ValPlayerPageProps = {
        playerData: null
    }

    const { platform, puuid } = context.params as { platform: string, puuid: string };
    // The riotId only contains the name, not the tagline, so we need to get that
    const playerInfoEndpointUrl = `${apiUrl}/val/player/${platform}/id/${puuid}/redirect`;
    const res = await fetch(playerInfoEndpointUrl);
    console.log(playerInfoEndpointUrl);
    if(res.ok === false) {
        console.log(res.status);
        let errorData: RequestError = await res.json();
        errorData.status_code = res.status;
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