import { LolMatch } from "@/models/LolMatch"
import { Player } from "@/models/Player"
import { useCallback, useEffect, useState, useRef } from "react";
import { Box, Grid, Stack, Typography, Checkbox, FormControlLabel, FormGroup, FormLabel, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import { Participant } from "@/models/LolMatchData";
import { getMostPlayedChampion, LolStatistics } from "@/models/LolStatistics";
import { defaultMapInfo, getAllMapInfo, getMapInfo, MapInfo } from "@/models/mapInfo";
import { defaultQueueInfo, getAllQueueInfo, getQueueInfo, QueueInfo } from "@/models/queueInfo";
import { defaultModeInfo, getAllModeInfo, getModeInfo, ModeInfo } from "@/models/modeInfo";
import { defaultTypeInfo, getAllTypeInfo, getTypeInfo, TypeInfo } from "@/models/typeInfo";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.css'; // Optional theme CSS

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

    let statistics = useRef(new LolStatistics(player, lolMatches));
    let tableColumns = useRef<any[]>([]);
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
            tableColumns.current.push(column);
        }
    }

    useEffect(() => {
        if (player !== null && lolMatches !== null) {
            setMatchYetToDownloadCount(player["lol_match_ids"].length - lolMatches.length);
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

    function getMatchHistoryListing(lolMatch: LolMatch) {
        let playerData: Participant = lolMatch.json_data.info.participants.find((participant) => participant.puuid === (player as Player)._id) as Participant;

        return <div key={lolMatch._id}>{playerData.champion_name}: {playerData.kills}/{playerData.deaths}/{playerData.assists} - {lolMatch.json_data.info.mode}/{lolMatch.json_data.info.type}, played on {(new Date(lolMatch.json_data.info.start_millis)).toLocaleDateString()}</div>
    }

    function getMatchHistoryListingTable(lolMatch: LolMatch): React.ReactNode {
        let playerData: Participant = lolMatch.json_data.info.participants.find((participant) => participant.puuid === (player as Player)._id) as Participant;

        let rowData: Record<string, any> = {};

        for (let [key, value] of Object.entries(playerData)) {
            // Renaming key to not-snake-case (because if it isn't in snake case, then the table will nicely format the names of the columns)
            while (key.includes("_")) {
                key = key.replace("_", " ");
            }
            rowData[key] = value;
        }

        let columnNames = [];

        for (let key of Object.keys(rowData).sort()) {

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

        console.log(rowData);
        console.log(columnNames);

        return (
            <div style={{ height: 200, width: "100%" }}>
                <AgGridReact className="champion-table ag-theme-material">
                    rowData={rowData}
                    columnDefs={columnNames}
                    defaultColDef={defaultColDef}
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
                                    <span className="subtitle center-text">Processed {lolMatches.length} games from {new Date(statistics.current.earliestGameTime).toLocaleDateString()} to {new Date(statistics.current.latestGameTime).toLocaleDateString()}.</span>
                                    <br />
                                </Stack>
                                <div className="center-text">
                                    <Button
                                        className=""
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
                                            <FormLabel component="legend">Map Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.mapIdPlayCount).map(mapId => getMapInfo(Number(mapId), allMapInfo.current)).map(mapInfo => (
                                                <>
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
                                                </>
                                            )))}
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormGroup>
                                            <FormLabel component="legend">Queue Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.queueIdPlayCount).map(queueId => getQueueInfo(Number(queueId), allQueueInfo.current)).map(queueInfo => (
                                                <>
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
                                                </>
                                            )))}
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormGroup>
                                            <FormLabel component="legend">Mode Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.modePlayCount).map(modeName => getModeInfo(modeName, allModeInfo.current)).map(modeInfo => (
                                                <>
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
                                                </>
                                            )))}
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormGroup>
                                            <FormLabel component="legend">Type Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.typePlayCount).map(typeName => getTypeInfo(typeName, allTypeInfo.current)).map(typeInfo => (
                                                <>
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
                                                </>
                                            )))}
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormGroup>
                                            <FormLabel component="legend">Version Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.versionPlayCount).map(version => (
                                                <>
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
                                                </>
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
                                            <span className="specific-statistic">Most Played: {getMostPlayedChampion(statistics.current.playedChampions).championName} ({(getMostPlayedChampion(statistics.current.playedChampions).playCount)} times)</span>
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
                                        <div key={friend.puuid} className="friend-info">
                                            <div className="friend-name">{index + 1}. {friend.summonerName[friend.summonerName.length - 1]}</div>
                                            <div className="friend-games-played">Games Played Together: {friend.playCount}</div>
                                            <div className="friend-kda">Your KDA with them: {((friend.yourKills + friend.yourAssists) / friend.yourDeaths).toFixed(2)}</div>
                                            <div className="friend-kda">Their KDA with you: {((friend.friendKills + friend.friendAssists) / friend.friendDeaths).toFixed(2)}</div>
                                            <div className="your-champs">
                                                With your friend, you played {Object.keys(friend.youPlayed).length} different champions.<br />
                                                You really liked playing <span className="friend-info-your-champion-name">{getMostPlayedChampion(friend.youPlayed).championName}</span> with them ({getMostPlayedChampion(friend.youPlayed).playCount} times).
                                            </div>
                                            <div className="friend-champs">
                                                With you, your friend played {Object.keys(friend.friendPlayed).length} different champions.<br />
                                                They really liked playing <span className="friend-info-friend-champion-name">{getMostPlayedChampion(friend.friendPlayed).championName}</span> with you ({getMostPlayedChampion(friend.friendPlayed).playCount} times).
                                            </div>
                                        </div>
                                    ))
                                }
                            </Stack>
                            <br/>
                            <Stack direction="column">
                                <span className="match-filters-label">Match History</span>
                                <span className="match-filters-label-subtitle">{"A list of every match you've played, in chronological order."}</span>
                                <br />
                                {lolMatches.map((lolMatch) => {
                                    return (
                                        <>
                                            {getMatchHistoryListing(lolMatch)}
                                            {/* {getMatchHistoryListingTable(lolMatch)} */}
                                        </>
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