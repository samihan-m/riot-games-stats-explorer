import { LolMatch } from "@/models/lol/LolMatch"
import { Player } from "@/models/Player"
import { useCallback, useEffect, useState, useRef } from "react";
import { Box, Grid, Stack, Typography, Checkbox, FormControlLabel, FormGroup, FormLabel, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import { Participant } from "@/models/lol/LolMatchData";
import { ChampionPlayCount, getMostPlayedChampion, LolStatistics } from "@/models/lol/LolStatistics";
import { defaultMapInfo, getAllMapInfo, getMapInfo, MapInfo } from "@/models/lol/mapInfo";
import { defaultQueueInfo, getAllQueueInfo, getQueueInfo, QueueInfo } from "@/models/lol/queueInfo";
import { defaultModeInfo, getAllModeInfo, getModeInfo, ModeInfo } from "@/models/lol/modeInfo";
import { defaultTypeInfo, getAllTypeInfo, getTypeInfo, TypeInfo } from "@/models/lol/typeInfo";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.css'; // Optional theme CSS

// SUPER IMPORTANT TODO: The "remaining X matches will slowly be downloaded over time" message should not appear unless the player IS BEING UPDATED.
// This might be an API issue.


// TODO: Add a way (slider?) to select what dates to look at games from
// TODO: Make the match history listings more interesting to look at
// TODO: Have the server send me a discord message or something every time a request is made with the name of the summoner being requested
// TODO: Maybe add a little display of champion icons * the number of times you played them next to each friend info display
// TODO: Add a 'my philosophy' section to the footer explaining how last year I made a 'your year in lol' thing but didn't have all the matches, 
//       so I put this out in may to get people to download all their early year games sooner in the year than last year so I can have all the games
// TODO: make all the html classes tailwind classes

type SummonerProfileProps = {
    searchedSummonerName: string,
    playerData: Player | null,
    lolMatches: LolMatch[] | null,
    updatePlayerDataCallback: () => Promise<void>,
    isCurrentlyUpdating: boolean,
}

export default function SummonerProfile(props: SummonerProfileProps) {
    const searchedSummonerName = props.searchedSummonerName;
    const [player, setPlayer] = useState<Player | null>(null);
    const [lolMatches, setLolMatches] = useState<LolMatch[] | null>(null);
    const [matchYetToDownloadCount, setMatchYetToDownloadCount] = useState<number | null>(null);

    let statistics = useRef<LolStatistics>(new LolStatistics(null, null));
    let tableColumns = useRef<Record<string, string | number | boolean>[]>([]);
    const defaultColDef = {
        sortable: true,
        resizable: true,
        width: 150,
    };

    let allMapInfo = useRef<MapInfo[]>(defaultMapInfo);
    let allQueueInfo = useRef<QueueInfo[]>(defaultQueueInfo);
    let allModeInfo = useRef<ModeInfo[]>(defaultModeInfo);
    let allTypeInfo = useRef<TypeInfo[]>(defaultTypeInfo);

    const [mapIdFilterSet, setMapIdFilterSet] = useState<Set<number>>(new Set<number>());
    const [queueIdFilterSet, setQueueIdFilterSet] = useState<Set<number>>(new Set<number>());
    const [modeFilterSet, setModeFilterSet] = useState<Set<string>>(new Set<string>());
    const [typeFilterSet, setTypeFilterSet] = useState<Set<string>>(new Set<string>());
    const [versionFilterSet, setVersionFilterSet] = useState<Set<string>>(new Set<string>());

    const [matchIdsSetToDetailedDisplay, setMatchIdsSetToDetailedDisplay] = useState<Set<string>>(new Set<string>());

    useEffect(() => {
        async function loadInfoConstants() {
            allMapInfo.current = await getAllMapInfo();
            allQueueInfo.current = await getAllQueueInfo();
            allModeInfo.current = await getAllModeInfo();
            allTypeInfo.current = await getAllTypeInfo();
        }

        loadInfoConstants();
    }, [])

    useEffect(() => {
        setPlayer(props.playerData);
        setLolMatches(props.lolMatches);
    }, [props]);

    let mostPlayedChampion: ChampionPlayCount = getMostPlayedChampion(statistics.current.playedChampions);

    const calculateStatistics = useCallback(() => {
        if (player === null || lolMatches === null) {
            return;
        }

        statistics.current = new LolStatistics(player, lolMatches);

        rerenderTable();

    }, [player, lolMatches, statistics]);


    function rerenderTable() {
        for (let champStatsObj of statistics.current.allChampionSpecificStatistics) {
            delete champStatsObj["_meta"]
            delete champStatsObj["bounty_level"]
            delete champStatsObj["champion_id"]
            delete champStatsObj["champion_name"]
            delete champStatsObj["champion_transform"]
            delete champStatsObj["individual_position"]
            delete champStatsObj["item0"]
            delete champStatsObj["item1"]
            delete champStatsObj["item2"]
            delete champStatsObj["item3"]
            delete champStatsObj["item4"]
            delete champStatsObj["item5"]
            delete champStatsObj["item6"]
            delete champStatsObj["id"]
            delete champStatsObj["profile_icon_id"]
            delete champStatsObj["puuid"]
            delete champStatsObj["_lazy__perks"]
            delete champStatsObj["riot_id_name"]
            delete champStatsObj["riot_id_tagline"]
            delete champStatsObj["summoner1_id"]
            delete champStatsObj["summoner2_id"]
            delete champStatsObj["summoner_id"]
            delete champStatsObj["summoner_level"]
            delete champStatsObj["summoner_name"]
            delete champStatsObj["team_id"]
            delete champStatsObj["eligible_for_progression"]
        }

        let statisticNameSet = new Set<string>();
        for (let champStatObj of statistics.current.allChampionSpecificStatistics) {
            for (let key of Object.keys(champStatObj)) {
                // Renaming key to not-snake-case (because if it isn't in snake case, then the table will nicely format the names of the columns)
                let originalKey = key;
                while (key.includes("_")) {
                    key = key.replace("_", " ");
                }
                if (originalKey !== key) {
                    champStatObj[key] = champStatObj[originalKey];
                    delete champStatObj[originalKey];
                }

                statisticNameSet.add(key);
            }
        }

        tableColumns.current = [];
        for (let key of Array.from(statisticNameSet.values()).sort()) {

            let column: Record<string, string | boolean | number> = {
                "field": key
            };
            if (key === "championName") {
                column["filter"] = true;
                column["pinned"] = "left";
                column["width"] = 170;
            }
            if (key === "gamesPlayed") {
                column["pinned"] = "left";
            }
            if (key === "winRate") {
                column["pinned"] = "left";
            }
            if (key === "k/d/a") {
                column["pinned"] = "left";
            }
            tableColumns.current.push(column);
        }
    }

    let dateOfOldestMatch = useRef(new Date());
    let dateOfNewestMatch = useRef(new Date());

    useEffect(() => {
        if (player !== null && lolMatches !== null) {
            setMatchYetToDownloadCount(player["lol_match_ids"].length - lolMatches.length);

            // Get the oldest and newest match dates
            // Need to ignore any broken matches (see: May 12th-13th connection issues leading to incomplete match objects being stored in match histories)
            // If all matches are broken, then the oldest and newest match dates will be the same as the current date
            // That's fine to me because if they have no valid matches then I'm fine with saying we've processed basically no matches

            const oldestDefinedMatch = lolMatches.find((lolMatch) => lolMatch.json_data.info !== undefined);
            const newestDefinedMatch = lolMatches.reverse().find((lolMatch) => lolMatch.json_data.info !== undefined);
            if(oldestDefinedMatch !== undefined) {
                dateOfOldestMatch.current = new Date(oldestDefinedMatch.json_data.info.start_millis);
            }
            if(newestDefinedMatch !== undefined) {
                dateOfNewestMatch.current = new Date(newestDefinedMatch.json_data.info.start_millis);
            }

            calculateStatistics();
        }
    }, [player, lolMatches, calculateStatistics]);

    function updateIdSet(set: Set<number>, id: number, isBoxChecked: boolean): Set<number> {
        let doFilterOutId = (isBoxChecked === false);

        // Making a copy so that a different set object is modified
        set = structuredClone(set);

        if (doFilterOutId === true) {
            set.add(id);
        }
        else {
            set.delete(id);
        }

        return set;
    }

    function updateNameSet(set: Set<string>, name: string, isBoxChecked: boolean): Set<string> {
        let doFilterOutId = (isBoxChecked === false);

        // Making a copy so that a different set object is modified
        set = structuredClone(set);

        if (doFilterOutId === true) {
            set.add(name);
        }
        else {
            set.delete(name);
        }

        return set;
    }

    const profilePictureUrl = `https://raw.communitydragon.org/latest/game/assets/ux/summonericons/profileicon${player?.lol_profile_icon_id}.png`;

    function getMatchHistoryListing(lolMatch: LolMatch): React.ReactNode {
        // Notice any broken matches (see: May 12th-13th connection issues leading to incomplete match objects being stored in match histories)
        if (lolMatch.json_data.info === undefined) {
            return <></>;
        }

        let playerData: Participant = lolMatch.json_data.info.participants.find((participant) => participant.puuid === (player as Player)._id) as Participant;
        if(playerData === undefined) {
            return <></>;
        }

        return (
            <Stack key={lolMatch.json_data.id}>
                <div className={"text-center"}>
                    {playerData.win ?
                        <span className="text-green-500">VICTORY</span>
                        :
                        <span className="text-red-600">DEFEAT</span>
                    }
                    {" - "}
                    {playerData.champion_name}: {playerData.kills}/{playerData.deaths}/{playerData.assists}
                    {" - "}
                    {getDisplayQueueType(lolMatch.json_data.info.queue_id)}: {getMapInfo(lolMatch.json_data.info.map_id, allMapInfo.current).mapName}
                    {" - "}
                    {(new Date(lolMatch.json_data.info.start_millis)).toLocaleDateString()}
                    {" "}
                    {matchIdsSetToDetailedDisplay.has(lolMatch.json_data.id) === false &&
                        <button className="hover:bg-blue-500 underline rounded px-1 text-white bg-slate-800" onClick={() => {
                            let updatedSet = new Set(matchIdsSetToDetailedDisplay.add(lolMatch.json_data.id));
                            setMatchIdsSetToDetailedDisplay(updatedSet);
                        }}>Show Match Details</button>
                    }
                    {matchIdsSetToDetailedDisplay.has(lolMatch.json_data.id) === true &&
                        <button className="hover:bg-blue-500 underline rounded px-1 text-white bg-slate-800" onClick={() => {
                            matchIdsSetToDetailedDisplay.delete(lolMatch.json_data.id);
                            let updatedSet = new Set(matchIdsSetToDetailedDisplay);
                            setMatchIdsSetToDetailedDisplay(updatedSet);
                        }}>Hide Match Details</button>
                    }
                </div>
                <div>
                    {matchIdsSetToDetailedDisplay.has(lolMatch.json_data.id) === true &&
                        getMatchHistoryListingTable(lolMatch)
                    }
                </div>
            </Stack>
        )
    }

    function getMatchHistoryListingTable(lolMatch: LolMatch): React.ReactNode {
        // Ignore any broken matches (see: May 12th-13th connection issues leading to incomplete match objects being stored in match histories)
        if (lolMatch.json_data.info === undefined) {
            return <></>;
        }

        let playerData: Participant = lolMatch.json_data.info.participants.find((participant) => participant.puuid === (player as Player)._id) as Participant;

        let playerStatistics: Record<string, any> = {};
        let statisticNameSet = new Set<string>();
        for (let [key, value] of Object.entries(playerData)) {
            // Renaming key to not-snake-case (because if it isn't in snake case, then the table will nicely format the names of the columns)
            while (key.includes("_")) {
                key = key.replace("_", " ");
            }

            statisticNameSet.add(key);
            playerStatistics[key] = value;
        }

        let columnNames = [];
        for (let key of Array.from(statisticNameSet.values()).sort()) {
            let column: Record<string, string | boolean | number> = {
                "field": key
            };
            if (key === "championName") {
                column["filter"] = true;
                column["pinned"] = "left";
                column["width"] = 170;
            }
            columnNames.push(column);
        }

        let rowData = [playerStatistics];

        return (
            <div style={{ height: 130, width: "100%" }}>
                <AgGridReact className="champion-table ag-theme-material"
                    rowData={rowData}
                    columnDefs={columnNames}
                    defaultColDef={defaultColDef}
                >
                </AgGridReact>
            </div>
        )
    }

    function getRandomNumber() {
        let number = Number((Math.random() * 100).toFixed(0));
        // This would be cool but it doesn't really do anything meaningful and it just takes CPU cycles so...
        // for(let character of Array.from(player.lol_name)) {
        //     number += character.charCodeAt(0);
        // }
        return number;
    }

    function getConditionalS(quantity: number): string {
        if (quantity === 1) {
            return "";
        }
        return "s";
    }

    function getDisplayQueueType(queueId: number): string {
        // Trims off the " games" part of the queue description (e.g. "Ranked 5v5 Solo games" -> "Ranked 5v5 Solo")

        let queueInfo = getQueueInfo(queueId, allQueueInfo.current);
        if (queueInfo.description === null) {
            return queueInfo.map;
        }
        let displayQueueType = queueInfo.description;
        if (displayQueueType.endsWith(" games")) {
            displayQueueType = displayQueueType.substring(0, displayQueueType.length - 6);
        }
        return displayQueueType;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            {player !== null &&
                <>
                    {player.lol_profile_icon_id &&
                        <div className="padding-bottom-1em">
                            <div className="profile-icon-container center-form">
                                <Image
                                    src={profilePictureUrl}
                                    alt="Profile picture"
                                    fill
                                    quality={100}
                                    priority
                                    sizes="100%"
                                />
                            </div>
                        </div>
                    }
                    <Typography className="center-text" variant="h3" component="div">
                        {player["lol_name"] === null ? searchedSummonerName : player["lol_name"]}
                    </Typography>
                    {player["lol_level"] !== null &&
                        <Typography className="center-text padding-bottom-05em" variant="h6" component="div">
                            Level {player["lol_level"]}
                        </Typography>
                    }
                    {lolMatches !== null &&
                        <>
                            <div className="center-text">
                                {/* Found {player["lol_match_ids"].length} matches. */}
                                {matchYetToDownloadCount !== null && matchYetToDownloadCount > 0 &&
                                    <div>
                                        Successfully downloaded {lolMatches.length} matches.
                                        The remaining {matchYetToDownloadCount} matches will slowly be downloaded over time. Check back later!
                                    </div>
                                }
                            </div>
                            <Box className="Statistics" sx={{ width: '100%' }}>
                                <Stack direction="column" className="header">
                                    <span className="subtitle center-text">Processed {lolMatches.length} games from {dateOfOldestMatch.current.toLocaleDateString()} to {dateOfNewestMatch.current.toLocaleDateString()}.</span>
                                    <br />
                                </Stack>
                                <div className="center-text">
                                    <Button
                                        className="bg-slate-500"
                                        variant="contained"
                                        color="primary"
                                        onClick={props.updatePlayerDataCallback}
                                        disabled={props.isCurrentlyUpdating}
                                    >
                                        {props.isCurrentlyUpdating ? <CircularProgress /> : "Update Player Data"}
                                    </Button>
                                </div>
                                <br />
                                <Stack direction="column" className="header">
                                    <span className="match-filters-label">Match Filters</span>
                                    <span className="match-filters-label-subtitle">Toggle which matches contribute to your displayed statistics.</span>
                                    <br /><br />
                                </Stack>
                                <Grid className="match-filters" container spacing={3} columns={5}>
                                    <Grid item xs={1}>
                                        <FormGroup>
                                            <FormLabel component="legend" className="text-white font-bold">Map Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.mapIdPlayCount).map(mapId => getMapInfo(Number(mapId), allMapInfo.current)).map(mapInfo => (
                                                <div key={mapInfo.mapId}>
                                                    <FormControlLabel
                                                        control={<Checkbox defaultChecked />}
                                                        onChange={(e) => {
                                                            let updatedMapIdFilterSet = updateIdSet(mapIdFilterSet, mapInfo.mapId, (e.target as HTMLInputElement).checked);
                                                            statistics.current.calculateStatistics(player, lolMatches, updatedMapIdFilterSet, queueIdFilterSet, modeFilterSet, typeFilterSet, versionFilterSet);
                                                            setMapIdFilterSet(updatedMapIdFilterSet);
                                                            rerenderTable();
                                                        }}
                                                        label={`${mapInfo.mapName} - ${mapInfo.notes} (${statistics.current.mapIdPlayCount[mapInfo.mapId]} game${getConditionalS(statistics.current.mapIdPlayCount[mapInfo.mapId])})`}
                                                    />
                                                </div>
                                            )))}
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormGroup>
                                            <FormLabel component="legend" className="text-white font-bold">Queue Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.queueIdPlayCount).map(queueId => getQueueInfo(Number(queueId), allQueueInfo.current)).map(queueInfo => (
                                                <div key={queueInfo.queueId}>
                                                    <FormControlLabel
                                                        control={<Checkbox defaultChecked />}
                                                        onChange={(e) => {
                                                            let updatedQueueIdFilterSet = updateIdSet(queueIdFilterSet, queueInfo.queueId, (e.target as HTMLInputElement).checked);
                                                            statistics.current.calculateStatistics(player, lolMatches, mapIdFilterSet, updatedQueueIdFilterSet, modeFilterSet, typeFilterSet, versionFilterSet);
                                                            setQueueIdFilterSet(updatedQueueIdFilterSet);
                                                            rerenderTable();
                                                        }}
                                                        label={`${queueInfo.map} - ${queueInfo.description} (${statistics.current.queueIdPlayCount[queueInfo.queueId]} game${getConditionalS(statistics.current.queueIdPlayCount[queueInfo.queueId])})`}
                                                    />
                                                </div>
                                            )))}
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormGroup>
                                            <FormLabel component="legend" className="text-white font-bold">Mode Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.modePlayCount).map(modeName => getModeInfo(modeName, allModeInfo.current)).map(modeInfo => (
                                                <div key={modeInfo.gameMode}>
                                                    <FormControlLabel
                                                        control={<Checkbox defaultChecked />}
                                                        onChange={(e) => {
                                                            let updatedModeFilterSet = updateNameSet(modeFilterSet, modeInfo.gameMode, (e.target as HTMLInputElement).checked);
                                                            statistics.current.calculateStatistics(player, lolMatches, mapIdFilterSet, queueIdFilterSet, updatedModeFilterSet, typeFilterSet, versionFilterSet);
                                                            setModeFilterSet(updatedModeFilterSet);
                                                            rerenderTable();
                                                        }}
                                                        label={`${modeInfo.gameMode} - ${modeInfo.description} (${statistics.current.modePlayCount[modeInfo.gameMode]} game${getConditionalS(statistics.current.modePlayCount[modeInfo.gameMode])})`}
                                                    />
                                                </div>
                                            )))}
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormGroup>
                                            <FormLabel component="legend" className="text-white font-bold">Type Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.typePlayCount).map(typeName => getTypeInfo(typeName, allTypeInfo.current)).map(typeInfo => (
                                                <div key={typeInfo.gametype}>
                                                    <FormControlLabel
                                                        control={<Checkbox defaultChecked />}
                                                        onChange={(e) => {
                                                            let updatedTypeFilterSet = updateNameSet(typeFilterSet, typeInfo.gametype, (e.target as HTMLInputElement).checked);
                                                            statistics.current.calculateStatistics(player, lolMatches, mapIdFilterSet, queueIdFilterSet, modeFilterSet, updatedTypeFilterSet, versionFilterSet);
                                                            setTypeFilterSet(updatedTypeFilterSet);
                                                            rerenderTable();
                                                        }}
                                                        label={`${typeInfo.gametype} - ${typeInfo.description} (${statistics.current.typePlayCount[typeInfo.gametype]} game${getConditionalS(statistics.current.typePlayCount[typeInfo.gametype])})`}
                                                    />
                                                </div>
                                            )))}
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormGroup>
                                            <FormLabel component="legend" className="text-white font-bold">Version Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.versionPlayCount).map(version => (
                                                <div key={version}>
                                                    <FormControlLabel
                                                        control={<Checkbox defaultChecked />}
                                                        onChange={(e) => {
                                                            let updatedVersionFilterSet = updateNameSet(versionFilterSet, version, (e.target as HTMLInputElement).checked);
                                                            statistics.current.calculateStatistics(player, lolMatches, mapIdFilterSet, queueIdFilterSet, modeFilterSet, typeFilterSet, updatedVersionFilterSet);
                                                            setVersionFilterSet(updatedVersionFilterSet);
                                                            rerenderTable();
                                                        }}
                                                        label={`${version} (${statistics.current.versionPlayCount[version]} game${getConditionalS(statistics.current.versionPlayCount[version])})`}
                                                    />
                                                </div>
                                            )))}
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                    <Grid item xs={6}>
                                        <Stack className="specific-statistic-column" direction="column">
                                            <span className="specific-statistic">Win Count: {statistics.current.totalWinCount}</span>
                                            {getRandomNumber() % 3 === 0 ? <span className="specific-statistic-subtitle">Wow!</span> : null}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack className="specific-statistic-column" direction="column">
                                            <span className="specific-statistic">Total Minions Slain: {statistics.current.totalMinionsSlain}</span>
                                            {getRandomNumber() % 3 === 0 ? <span className="specific-statistic-subtitle">Wow!</span> : null}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack className="specific-statistic-column" direction="column">
                                            <span className="specific-statistic">Total First Blood Kills: {statistics.current.totalFirstBloods}</span>
                                            {getRandomNumber() % 3 === 0 ? <span className="specific-statistic-subtitle">Wow!</span> : null}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack className="specific-statistic-column" direction="column">
                                            <span className="specific-statistic">Total Vision Score: {statistics.current.totalVisionScore}</span>
                                            {getRandomNumber() % 3 === 0 ? <span className="specific-statistic-subtitle">Wow!</span> : null}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack className="specific-statistic-column" direction="column">
                                            <span className="specific-statistic">Longest Killing Spree: {statistics.current.longestKillingSpree}</span>
                                            {getRandomNumber() % 3 === 0 ? <span className="specific-statistic-subtitle">Wow!</span> : null}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack className="specific-statistic-column" direction="column">
                                            <span className="specific-statistic">Pentakills: {statistics.current.pentakillCount}</span>
                                            {getRandomNumber() % 3 === 0 ? <span className="specific-statistic-subtitle">Wow!</span> : null}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack className="specific-statistic-column" direction="column">
                                            <span className="specific-statistic">KDA: {statistics.current.totalKDA}</span>
                                            {getRandomNumber() % 3 === 0 ? <span className="specific-statistic-subtitle">Wow!</span> : null}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack className="specific-statistic-column" direction="column">
                                            <span className="specific-statistic">Most Played: {mostPlayedChampion.championName} ({mostPlayedChampion.playCount} time{getConditionalS(mostPlayedChampion.playCount)})</span>
                                            {getRandomNumber() % 3 === 0 ? <span className="specific-statistic-subtitle">Wow!</span> : null}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>
                            <br />
                            <Stack direction="column" className="header">
                                <span className="match-filters-label">Statistics Table</span>
                                <span className="match-filters-label-subtitle">View all your stats! Resize column widths, click on a column header to sort, or hover the Champion Name column header and click on the ☰ button to search.</span>
                                <br />
                            </Stack>
                            <div style={{ height: 600, width: "100%" }}>
                                <AgGridReact className="champion-table ag-theme-material"
                                    rowData={statistics.current.allChampionSpecificStatistics}
                                    columnDefs={tableColumns.current}
                                    defaultColDef={defaultColDef}
                                ></AgGridReact>
                            </div>
                            <br />
                            <Stack direction="column" className="header">
                                <span className="match-filters-label">Your BFFs:</span>
                                <span className="match-filters-label-subtitle">{"Everyone you've played a game with, ordered by most games to least games played."}</span>
                                <br />
                            </Stack>
                            <Stack className="friend-section" direction="column">
                                {
                                    statistics.current.friendsPlayedWith.map((friend, index) => (
                                        <div key={index} className="friend-info">
                                            <div className="text-blue-500 text-2xl py-2">
                                                {index + 1}.
                                                {/* I have to use <a> here instead of <Link> because
                                                    if I try using Link, the links, when clicked, don't change the page URL and instead just refresh the page.
                                                    TODO: Figure out why this is happening and get back to using <Link> instead of <a>
                                                */}
                                                <a href={`/lol/${player.platform}/id/${friend.puuid}`} className="hover:bg-blue-500 underline rounded px-4 py-2 text-white bg-slate-800">
                                                    {friend.summonerName.at(-1)}
                                                </a>
                                            </div>
                                            <div className="friend-games-played">Games Played Together: {friend.playCount}</div>
                                            <div className="text-teal-500">Win Count: {friend.winCount}</div>
                                            <div className="text-teal-500">Win Rate: {(friend.winCount / friend.playCount * 100).toFixed(2)}%</div>
                                            {/* <div className="friend-kda">Your KDA with them: {((friend.yourKills + friend.yourAssists) / friend.yourDeaths).toFixed(2)} ({friend.yourKills} Kills, {friend.yourDeaths} Deaths, {friend.yourAssists} Assists) </div> */}
                                            {/* <div className="friend-kda">Their KDA with you: {((friend.friendKills + friend.friendAssists) / friend.friendDeaths).toFixed(2)} ({friend.friendKills} Kills, {friend.friendDeaths} Kills, {friend.friendAssists} Assists)</div> */}
                                            <div className="text-orange-500">
                                                <div>Your KDAs When Together:</div>
                                                <table className="mx-auto border-separate border-spacing-x-4">
                                                    <thead className="">
                                                        <tr>
                                                            <th></th>
                                                            <th className="font-normal">You</th>
                                                            <th className="font-normal">Them</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="font-bold">KDA</td>
                                                            <td className="font-bold">{((friend.yourKills + friend.yourAssists) / friend.yourDeaths).toFixed(2)}</td>
                                                            <td className="font-bold">{((friend.friendKills + friend.friendAssists) / friend.friendDeaths).toFixed(2)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Kills</td>
                                                            <td>{friend.yourKills}</td>
                                                            <td>{friend.friendKills}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Deaths</td>
                                                            <td>{friend.yourDeaths}</td>
                                                            <td>{friend.friendDeaths}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Assists</td>
                                                            <td>{friend.yourAssists}</td>
                                                            <td>{friend.friendAssists}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="your-champs">
                                                With your friend, you played {Object.keys(friend.youPlayed).length} unique champion{getConditionalS(Object.keys(friend.youPlayed).length)}.<br />
                                                You really liked playing <span className="friend-info-your-champion-name">{getMostPlayedChampion(friend.youPlayed).championName}</span> with them ({getMostPlayedChampion(friend.youPlayed).playCount} time{getConditionalS(getMostPlayedChampion(friend.youPlayed).playCount)}).
                                            </div>
                                            <div className="friend-champs">
                                                With you, your friend played {Object.keys(friend.friendPlayed).length} unique champion{getConditionalS(Object.keys(friend.friendPlayed).length)}.<br />
                                                They really liked playing <span className="friend-info-friend-champion-name">{getMostPlayedChampion(friend.friendPlayed).championName}</span> with you ({getMostPlayedChampion(friend.friendPlayed).playCount} time{getConditionalS(getMostPlayedChampion(friend.friendPlayed).playCount)}).
                                            </div>
                                        </div>
                                    ))
                                }
                            </Stack>
                            <br />
                            <Stack direction="column">
                                <span className="match-filters-label">Match History</span>
                                <span className="match-filters-label-subtitle">{"A list of every match you've played, in chronological order."}</span>
                                <br />
                                {lolMatches.map((lolMatch, index) => {
                                    return (
                                        <div key={index}>
                                            {getMatchHistoryListing(lolMatch)}
                                            {/* {getMatchHistoryListingTable(lolMatch)} */}
                                        </div>
                                    )
                                })}
                            </Stack>
                        </>
                    }
                </>
            }
        </Box>
    )
}