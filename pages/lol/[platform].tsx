import CustomHeadLayout from "@/components/common/CustomHeadLayout";
import { RequestError } from "@/models/Error";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import { Stack, Typography } from '@mui/material';
import CustomFooter from "@/components/common/CustomFooter";
import Link from "next/link";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

type PlatformPageProps = {
    platform: string,
    summonerNames: string[],
    error?: RequestError,
}

export default function PlatformPage(props: PlatformPageProps) {

    const doDisplayErrorContent = props.error !== undefined;
    const errorMessage = props.error?.detail as string;

    const platformDisplayName = props.platform.toUpperCase();

    return (
        <CustomHeadLayout title={`LoL Stats in ${platformDisplayName}`} description={`LoL Stats for the ${platformDisplayName} region in <insert current year here>`}>
            {
                // List every summoner in summoner_names as a link to their profile page.
                // If there are no summoners in summoner_names, display a message saying that there are no summoners.
            }
            {
                doDisplayErrorContent === false && props.summonerNames.length == 0 &&
                <Typography variant="h4" align="center">
                    No statistics for summoners from {platformDisplayName} are saved. Add a summoner by searching for them in the search bar.
                </Typography>
            }
            {
                doDisplayErrorContent === false && props.summonerNames.length > 0 &&
                <Stack>
                    <Typography variant="h4" align="center">
                        Most Recently Updated Summoners From {platformDisplayName}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                        Click on a summoner to see their profile page and statistics.
                    </Typography>
                    <div className="pt-8 text-3xl text-center">
                        {props.summonerNames.map((summoner_name, index) => {
                            return (
                                <div key={index} className="py-4">
                                    <Link href={`/lol/${props.platform}/${summoner_name}`} className="hover:bg-blue-500 underline rounded px-4 py-2 text-white bg-slate-800">
                                        {summoner_name}
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
            <CustomFooter />
        </CustomHeadLayout>
    )
}

export const getServerSideProps: GetServerSideProps<PlatformPageProps> = async (context) => {
    let props: PlatformPageProps = {
        platform: "",
        summonerNames: [],
    }

    const { platform } = context.query;
    props.platform = (platform as string);
    const platformInfoEndpointUrl = `${apiUrl}/lol/summoner/${platform}`;
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
        props.summonerNames = platformData;
    }

    return {
        props
    }
}