// This is the page that users will be directed to after they have signed out from Riot Sign On

import CustomHeadLayout from "@/components/common/CustomHeadLayout";
import { Stack, Box, Typography, Link } from "@mui/material";

export default function RiotSignedOutPage() {
    return (
        <CustomHeadLayout>
            <Stack direction="column" spacing={8}>
                <Typography variant="h4" align="center">
                    Successfully signed out from RSO. How did you do that? How did you get here?
                </Typography>
                <Typography variant="h4" align="center">
                    Go <Link href="/">Home</Link>
                </Typography>
            </Stack>
        </CustomHeadLayout>
    )
}