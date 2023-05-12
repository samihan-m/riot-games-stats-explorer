import Head from "next/head";
import { ReactNode } from "react";
import HeadingContent from "../HeadingContent";

type LayoutProps = {
    children: ReactNode,
    title?: string,
    description?: string
}

export default function CustomHeadLayout({children, title="Riot Stats Explorer", description="A website for looking at a recap of 2023 LoL/Valorant stats per player."}: LayoutProps) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <HeadingContent></HeadingContent>
            {/* A header can go here */}
            <main className="main-content">
                {children}
            </main>
            {/* A footer can go here */}
        </>
    )
}