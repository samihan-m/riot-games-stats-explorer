// This is the page that users will be redirected to after they sign in via the Riot Sign On OAuth flow

import CustomHeadLayout from "@/components/common/CustomHeadLayout";
import { Stack, Typography, Link } from "@mui/material";
import { GetServerSideProps } from "next";
import { platform } from "os";

type RiotSignOnCallbackPageProps = {
    puuid: string,
    platform: string,
    gameName: string,
    tagLine: string,
}

export default function RiotSignedOnPage(props: RiotSignOnCallbackPageProps) {
    return (
        <CustomHeadLayout>
            <Stack direction="column" spacing={8}>
                <Typography variant="h4" align="center">
                    Thanks for signing in, {props.gameName}#{props.tagLine}!
                </Typography>
                <Typography variant="h5" align="center">
                    Check out <Link href={`/val/${props.platform}/${props.gameName}/${props.tagLine}`}>your Valorant page</Link>!
                </Typography>
                <Typography variant="h4" align="center">
                    {/* TODO: this link should instead point the user to their valorant stats page */}
                    Go <Link href="/">Home</Link>
                </Typography>
            </Stack>
        </CustomHeadLayout>
    )
}

export const getServerSideProps: GetServerSideProps<RiotSignOnCallbackPageProps> = async (context) => {
    let props: RiotSignOnCallbackPageProps = {
        puuid: "",
        platform: "",
        gameName: "",
        tagLine: "",
    }

    const puuid = context.query.puuid;
    const platform = context.query.platform;
    const gameName = context.query.gameName;
    const tagLine = context.query.tagLine;

    // If no code query parameter is provided, then this page is being loaded incorrectly
    // Redirect the user to the Riot Sign On page
    if (puuid === undefined || platform === undefined || gameName === undefined || tagLine === undefined) {
        return {
            redirect: {
                destination: "/riot-sign-on",
                permanent: false,
            }
        }
    }
    props.puuid = puuid as string;
    props.platform = platform as string;
    props.gameName = gameName as string;
    props.tagLine = tagLine as string;

    return {
        props
    }
}

