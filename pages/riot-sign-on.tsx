// This is the page that users will be directed to when they want to sign in via the Riot Sign On OAuth flow
// It will need to have a button or link that links to  https://auth.riotgames.com/authorize
// It also needs to add query parameters:               ?redirect_uri=http://local.leagueoflegends.com:3000/oauth2-callback&client_id=oujzg5jiibvzo&response_type=code&scope=openid

import CustomHeadLayout from "@/components/common/CustomHeadLayout";
import { Stack, Link, Typography, Button } from "@mui/material";
import { GetServerSideProps } from "next";

type RiotSignOnPageProps = {
    hostName: string,
}

export default function RiotSignOnPage(props: RiotSignOnPageProps) {
    const CLIENT_ID = "a19fcb64-02dd-456f-b47f-a3ec2867d0c4";
    // Get full URL of this page to construct the redirect_uri
    const ROOT = props.hostName;
    const REDIRECT_URI = `https://${ROOT}/riot-sign-on-callback`;
    const RSO_AUTH_URL = `https://auth.riotgames.com/authorize?redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&response_type=code&scope=openid`;

    return (
        <CustomHeadLayout>
            <Stack direction="column" spacing={8} alignItems="center">
                <Typography variant="h4" align="center">
                    Connect your Riot Account
                </Typography>
                <Link href={RSO_AUTH_URL} className="text-3xl bg-red-600 border-4 border-red-700 rounded-md pt-4 pb-4 pl-8 pr-8 text-white decoration-white hover:bg-red-500 hover:border-red-600">Sign in with Riot ID</Link>
                By signing in to view your own stats, you are making your stats page public to any user on the site.
            </Stack>
        </CustomHeadLayout>
    )
}

export const getServerSideProps: GetServerSideProps<RiotSignOnPageProps> = async (context) => {
    let props: RiotSignOnPageProps = {
        hostName: "",
    }

    const hostName = context.req.headers.host;
    props.hostName = hostName as string;

    return {
        props
    }
}