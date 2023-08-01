import { Typography } from '@mui/material';
import Link from 'next/link';

type AllLolPlatformsProps = {
    allPlatforms: string[],
}

export default function AllLolPlatforms(props: AllLolPlatformsProps) {
    return (
        <div>
            <Typography variant="h4" align="center">
                All LoL Platforms (Regions)
            </Typography>
            <Typography variant="subtitle1" align="center">
                Click on a platform to see the most recently updated summoners from that platform.
            </Typography>
            <div className="pt-16 text-3xl flex flex-wrap justify-evenly">
                {props.allPlatforms.map((platform, index) => {
                    return (
                        <div key={index}>
                            <Link href={`/lol/${platform}`} className="hover:bg-blue-500 underline rounded px-4 py-2 text-white bg-slate-800">
                                {platform.toUpperCase()}
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}