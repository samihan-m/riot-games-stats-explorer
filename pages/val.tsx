import SummonerSearch from "@/components/common/SummonerSearch";
import CustomHeadLayout from "@/components/common/CustomHeadLayout";
import { RequestError } from "@/models/Error";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import { Stack, Typography, Box } from "@mui/material";
import AllValPlatforms from "@/components/common/AllValPlatforms";
import ValorantPlayerSearch from "@/components/common/ValorantSearch";
import CustomFooter from "@/components/common/CustomFooter";
import Link from "next/link";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

type ValPageProps = {
    allPlatforms: string[],
    error?: RequestError,
}

export default function ValPage(props: ValPageProps) {

    const doDisplayErrorContent = props.error !== undefined;
    const errorMessage = props.error?.detail as string;

    return (
        <CustomHeadLayout title={`Select a Valorant Platform/Region`} description={`Select a Valorant Platform/Region`}>
            <Stack direction="column" spacing={8}>
                <Stack>
                    {doDisplayErrorContent === false &&
                        <AllValPlatforms allPlatforms={props.allPlatforms} />
                    }
                    {doDisplayErrorContent &&
                        <Stack direction={"column"} spacing={1} className="summoner-search-error-messages-container">
                            {errorMessage + " "} {/* Adding a space here because otherwise the error message and the following line have no space in between.*/}
                            Try using the search bar to find a specific player.
                        </Stack>
                    }
                </Stack>
                <Stack>
                    <Typography variant="h4" align="center">
                        Player Search
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                        Enter a Riot ID to search for.
                    </Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" className="py-16">
                        <ValorantPlayerSearch searchBarWidthOverride="50%" />
                    </Box>
                    <Typography variant="h6" align="center">
                        If you want to view your own statistics, give us access by signing in with your Riot ID.
                    </Typography>
                    <Link href="/riot-sign-on" className="mt-2 self-center text-xl bg-red-600 border-4 border-red-700 rounded-md pt-4 pb-4 pl-8 pr-8 text-white underline decoration-white hover:bg-red-500 hover:border-red-600">Sign in with Riot ID</Link>
                </Stack>
            </Stack>

        </CustomHeadLayout>
    )
}

export const getServerSideProps: GetServerSideProps<ValPageProps> = async (context) => {
    let props: ValPageProps = {
        allPlatforms: [],
    }

    const platformListEndpointUrl = `${apiUrl}/val/platforms`;
    const res = await fetch(platformListEndpointUrl);
    if (res.ok === false) {
        console.log(res.status);
        const errorData: RequestError = await res.json();
        // Possible values:
        // ??? - This should never happen. The server literally doesn't do anything to return the information so it should never fail.
        props.error = errorData;
    }
    else {
        const allPlatforms: string[] = await res.json();
        props.allPlatforms = allPlatforms.sort();
    }

    return {
        props
    }
}