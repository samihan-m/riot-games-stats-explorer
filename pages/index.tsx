import CustomHeadLayout from "@/components/common/CustomHeadLayout";
import { Stack, Box, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    // Show a row two icons in the center of page - these are clickable links
    // One icon is for LoL, the other is for Valorant
    // When clicked, the user is taken to the respective page

    return (
        <CustomHeadLayout>
            <Stack direction="column" spacing={8}>
                <Typography variant="h4" align="center">
                    Which game are you looking for?
                </Typography>
                <Stack direction="row" justifyContent="space-evenly">
                    <Stack alignItems="center" spacing={4}>
                        <Link href="/lol" className="rounded bg-slate-800 hover:bg-blue-500 p-8">
                            <Box sx={{ position: 'relative', width: "20rem", height: "20rem", padding: "10rem" }}>
                                <Image src="/lol-logo.png" alt="" fill />
                            </Box>
                        </Link>
                        <Typography variant="h4">
                            League of Legends
                        </Typography>
                    </Stack>
                    <Stack alignItems="center" spacing={4}>
                        {/* <Link href="#" className="rounded bg-slate-800 hover:bg-blue-500 p-8"> */}
                        <Link href="#" className="rounded p-8 hover:cursor-not-allowed grayscale">
                            <Box sx={{ position: 'relative', width: "20rem", height: "20rem", padding: "10rem" }}>
                                <Image src="/valorant-logo.png" alt="" fill />
                            </Box>
                        </Link>
                        <Typography variant="h4" align="center">
                            🚧 Valorant 🚧 <br /> (Under Construction)
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </CustomHeadLayout>
    )
}
