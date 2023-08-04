import Head from "next/head";
import { ReactNode } from "react";
import HeadingContent from "../HeadingContent";
import Link from "next/link";

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
            <div className="bg-gray-900 min-h-screen">
                <HeadingContent></HeadingContent>
                <main className="text-white mt-12 mr-12 ml-12">
                    {children}
                </main>
                {/* A footer can go here */}
            </div>
        </>
    )
}