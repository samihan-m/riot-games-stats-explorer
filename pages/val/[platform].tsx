import CustomHeadLayout from "@/components/common/CustomHeadLayout";
import { RequestError } from "@/models/Error";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import { Stack, Typography } from '@mui/material';
import CustomFooter from "@/components/common/CustomFooter";
import Link from "next/link";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

type ValPlatformPageProps = {
    platform: string,
    riotIds: string[], // This is a list of "gameName#tagLine" strings
    error?: RequestError,
}

export default function ValPlatformPage(props: ValPlatformPageProps) {

    const doDisplayErrorContent = props.error !== undefined;
    const errorMessage = props.error?.detail as string;

    const platformDisplayName = props.platform.toUpperCase();

    const gameNames = props.riotIds.map(riotId => riotId.split("#")[0]);
    const tagLines = props.riotIds.map(riotId => riotId.split("#")[1]);

    return (
        <CustomHeadLayout title={`Valorant Stats in ${platformDisplayName}`} description={`LoL Stats for the ${platformDisplayName} region in <insert current year here>`}>
            {
                // List every player in riotIds as a link to their profile page.
                // If there are no players, display a message saying that there are none.
            }
            {
                doDisplayErrorContent === false && props.riotIds.length == 0 &&
                <Typography variant="h4" align="center">
                    No statistics for players from {platformDisplayName} are saved. 
                </Typography>
            }
            {
                doDisplayErrorContent === false && props.riotIds.length > 0 &&
                <Stack>
                    <Typography variant="h4" align="center">
                        Most Recently Updated Players From {platformDisplayName}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                        Click on a player to see their profile page and statistics.
                    </Typography>
                    <div className="pt-8 text-3xl text-center">
                        {props.riotIds.map((riotId, index) => {
                            return (
                                <div key={index} className="py-4">
                                    <Link href={`/val/${props.platform}/${gameNames[index]}/${tagLines[index]}`} className="hover:bg-blue-500 underline rounded px-4 py-2 text-white bg-slate-800">
                                        {riotId}
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </Stack>
            }
            {doDisplayErrorContent &&
                <Stack direction={"column"} spacing={1} className="summoner-search-error-messages-container">
                    {errorMessage + " "} {/* Adding a space here because otherwise the error message and the following line have no space in between.*/}
                    Try searching for a different region.
                </Stack>
            }
            <Stack alignItems="center" className="pt-8">
                <Typography variant="h6" align="center">
                    If you want to view your own statistics, give us access by signing in with your Riot ID.
                </Typography>
                <Link href="/riot-sign-on" className="mt-2 self-center text-xl bg-red-600 border-4 border-red-700 rounded-md pt-4 pb-4 pl-8 pr-8 text-white underline decoration-white hover:bg-red-500 hover:border-red-600">Sign in with Riot ID</Link>
            </Stack>
            <CustomFooter />
        </CustomHeadLayout>
    )
}

export const getServerSideProps: GetServerSideProps<ValPlatformPageProps> = async (context) => {
    let props: ValPlatformPageProps = {
        platform: "",
        riotIds: [],
    }

    const { platform } = context.query;
    props.platform = (platform as string);
    const platformInfoEndpointUrl = `${apiUrl}/val/player/${platform}`;
    const res = await fetch(platformInfoEndpointUrl);
    if (res.ok === false) {
        console.log(res.status);
        const errorData: RequestError = await res.json();
        // Possible values:
        // 422: Invalid platform
        props.error = errorData;
    }
    else {
        const platformData: string[] = await res.json();
        props.riotIds = platformData;
    }

    return {
        props
    }
}