// This is the page that will be used as the callback for the Riot Sign On OAuth flow
// It will need to send a request to our API to perform the server-to-server call to exchange the code provided as a query parameter for Access, Identity, and Refresh tokens

import CustomHeadLayout from "@/components/common/CustomHeadLayout";
import { Stack, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

import { RequestError } from "@/models/Error";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { ValPlayer } from "@/models/val/ValPlayer";

type RiotSignOnCallbackPageProps = {
    hostName: string,
    code: string,
}

// example response: 
// ?code=dXcxOmF0cFlCQjlhZllqUXlQYTU2bXd6VGcueGNra3VDZmx2YW50Y3VvMW13OGRuZw%3D%3D&iss=https%3A%2F%2Fauth.riotgames.com&session_state=-f897OBgoKFca2zZySrYmDuN2UBwSB2TIbRIgEfrgVs.yQ1SV9ijmIyrR1vqGrtDjw

export default function RiotSignOnCallbackPage(props: RiotSignOnCallbackPageProps) {
    const router = useRouter();
    const CODE = props.code;
    const ROOT = props.hostName;
    const RSO_EXCHANGE_ENDPOINT = `${apiUrl}/rso-exchange`;
    const REDIRECT_URI = `https://${ROOT}/riot-sign-on-callback`;
    const URL_WITH_CODE = `${RSO_EXCHANGE_ENDPOINT}?code=${CODE}&redirect_uri=${REDIRECT_URI}`;

    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        async function exchangeCodeForTokens() {
            console.log(URL_WITH_CODE);
            const res = await fetch(URL_WITH_CODE);
            if (res.ok === false) {
                console.log(res.status);
                const errorData: RequestError = await res.json();
                console.log(errorData);
                setErrorMessage(errorData.detail);
            }
            else {
                console.log("Signed on successfully.")
                let responseJson: ValPlayer = await res.json();
                console.log(responseJson);
                // let identityToken = responseJson["identity_token"];
                // console.log("Setting identity token cookie: " + identityToken)
                // setCookie("rso_identity_token", identityToken);
                // console.log("Cookie set to: " + getCookie("rso_identity_token"));
                console.log("Redirecting...")
                window.location.href = window.origin + `/riot-signed-on?puuid=${responseJson._id}&platform=${responseJson.platform}&gameName=${responseJson.game_name}&tagLine=${responseJson.tag_line}`;
                // router.push(`/riot-signed-on?puuid=${responseJson._id}&platform=${responseJson.platform}&gameName=${responseJson.game_name}&tagLine=${responseJson.tag_line}`);
            }
        }
        exchangeCodeForTokens();
    }, [URL_WITH_CODE, router]);

    return (
        <CustomHeadLayout>
            <Stack direction="column" spacing={8}>
                {errorMessage === undefined &&
                    <Stack direction={"column"} alignItems="center" spacing={4}>
                        <Typography variant="h4">
                            Loading...
                        </Typography>
                        <CircularProgress />
                    </Stack>
                }
                {errorMessage !== undefined &&
                    <Stack direction={"column"} spacing={4} alignItems="center" color="red">
                        {errorMessage}
                        <Link href={"/riot-sign-on"}>Go Back</Link>
                    </Stack>
                }

            </Stack>
        </CustomHeadLayout>
    )
}

export const getServerSideProps: GetServerSideProps<RiotSignOnCallbackPageProps> = async (context) => {
    let props: RiotSignOnCallbackPageProps = {
        hostName: "",
        code: "",
    }

    const hostName = context.req.headers.host;
    props.hostName = hostName as string;

    const code = context.query.code;
    // If no code query parameter is provided, then this page is being loaded incorrectly
    // Redirect the user to the Riot Sign On page
    if (code === undefined) {
        return {
            redirect: {
                destination: "/riot-sign-on",
                permanent: false,
            }
        }
    }
    props.code = code as string;

    return {
        props
    }
}