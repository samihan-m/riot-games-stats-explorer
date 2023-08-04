import SummonerSearch from "@/components/common/SummonerSearch";
import CustomHeadLayout from "@/components/common/CustomHeadLayout";
import { RequestError } from "@/models/Error";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import { Stack, Typography, Box } from "@mui/material";
import Link from "next/link";
import AllLolPlatforms from "@/components/common/AllLolPlatforms";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

type LolPageProps = {
    allPlatforms: string[],
    error?: RequestError,
}

export default function LolPage(props: LolPageProps) {

    const doDisplayErrorContent = props.error !== undefined;
    const errorMessage = props.error?.detail as string;

    return (
        <CustomHeadLayout title={`Select a LoL Platform/Region`} description={`Select a LoL Platform/Region`}>
            <Stack direction="column" spacing={8}>
                <Stack>
                    {doDisplayErrorContent === false &&
                        <AllLolPlatforms allPlatforms={props.allPlatforms} />
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
                        Summoner Search
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                        Enter a Summoner name and the region of that summoner to view their stats.
                    </Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" className="pt-16">
                        <SummonerSearch searchBarWidthOverride="50%" />
                    </Box>
                </Stack>

            </Stack>

        </CustomHeadLayout>
    )
}

export const getServerSideProps: GetServerSideProps<LolPageProps> = async (context) => {
    let props: LolPageProps = {
        allPlatforms: [],
    }

    const platformListEndpointUrl = `${apiUrl}/lol/platforms`;
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