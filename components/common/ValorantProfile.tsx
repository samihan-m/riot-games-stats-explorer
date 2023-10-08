import { defaultValMapInfo } from "@/models/val/DefaultValMapInfo";
import { defaultValQueueInfo } from "@/models/val/DefaultValQueueInfo";
import { ValMapInfo, getAllValMapInfo, getValMapInfo } from "@/models/val/ValMapInfo";
import { ValMatch } from "@/models/val/ValMatch"
import { ValPlayer } from "@/models/val/ValPlayer"
import { ValQueueInfo, getAllValQueueInfo, getValQueueInfo } from "@/models/val/ValQueueInfo";
import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography, Stack, Button, CircularProgress, Grid, FormGroup, FormLabel, FormControlLabel, Checkbox, Table } from "@mui/material";
import Image from "next/image";
import { ValMatchStatistics, ValMatchStatisticsByFriend, ValStatistics, getFirstElement } from "@/models/val/ValStatistics";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.css'; // Optional theme CSS
import { ValAgentInfo, getAgentName, getAgentUuidNameMap, getAllValAgentInfo } from "@/models/val/ValAgentInfo";
import { defaultValAgentInfo } from "@/models/val/DefaultValAgentInfo";

type ValorantProfileProps = {
    searchedRiotId: string,
    playerData: ValPlayer | null,
    valMatches: ValMatch[] | null,
    updatePlayerDataCallback: () => Promise<void>,
    isCurrentlyUpdating: boolean,
}

export default function ValorantProfile(props: ValorantProfileProps) {

    const searchedRiotId = props.searchedRiotId;
    const player = props.playerData;
    const matches = props.valMatches;
    const [matchYetToDownloadCount, setMatchYetToDownloadCount] = useState<number | null>(null);

    let statistics = useRef<ValStatistics>(new ValStatistics());
    let tableColumns = useRef<Record<string, string | number | boolean>[]>([]);
    const defaultColDef = {
        sortable: true,
        resizable: true,
        width: 150,
    };

    let allValMapInfo = useRef<ValMapInfo[]>(defaultValMapInfo);
    let allValQueueInfo = useRef<ValQueueInfo[]>(defaultValQueueInfo);
    let allValAgentInfo = useRef<ValAgentInfo[]>(defaultValAgentInfo);
    let valAgentUuidToNameMap = useRef<Map<string, string>>(getAgentUuidNameMap(defaultValAgentInfo))

    // Update with the latest map and queue info
    useEffect(() => {
        async function loadInfoConstants() {
            allValMapInfo.current = await getAllValMapInfo();
            allValQueueInfo.current = await getAllValQueueInfo();
            let latestValAgentInfo = await getAllValAgentInfo();
            allValAgentInfo.current = latestValAgentInfo;
            valAgentUuidToNameMap.current = getAgentUuidNameMap(latestValAgentInfo);
        }

        loadInfoConstants();
    }, []);

    // Sets of IDs to filter out of the list of matches we're calculating stats for
    const [mapUrlFilterSet, setMapUrlFilterSet] = useState<Set<string>>(new Set<string>());
    const [queueIdFilterSet, setQueueIdFilterSet] = useState<Set<string>>(new Set<string>());
    const [versionFilterSet, setVersionFilterSet] = useState<Set<string>>(new Set<string>());
    const [seasonFilterSet, setSeasonFilterSet] = useState<Set<string>>(new Set<string>());

    // To control which matches have their statistics table displayed
    const [matchIdsSetToDetailedDisplay, setMatchIdsSetToDetailedDisplay] = useState<Set<string>>(new Set<string>());

    const mostPlayedAgentUuid = useRef<string>("");

    const calculateStatistics = useCallback(() => {
        // Ensure that we have a player and matches to calculate statistics for
        if (player === null || matches === null) {
            return;
        }

        statistics.current = new ValStatistics(player, matches);
        // Inject agent name into the agent stats objects
        for (let agentStatObj of statistics.current.matchStatisticsByAgent) {
            agentStatObj.agentName = getAgentName(agentStatObj.agentUuid, allValAgentInfo.current);
        }
        rerenderTable();
    }, [player, matches]);

    // A modified statistics object that has a few additional fields to show in the table
    let tableRowData = useRef<Record<string, any>[]>([]);
    function rerenderTable() {
        tableRowData.current = [];

        // Get the list of possible keys
        let statisticNameSet = new Set<string>(
            ["agent", "winRate", "k/d/a"]
        );
        for (let agentStatsObj of statistics.current.matchStatisticsByAgent) {
            let mostPlayedAgentId = Array.from(agentStatsObj.agentsPlayed.keys())[0];
            let newTableRow: Record<string, any> = {
                "agent": agentStatsObj.agentName,
                "winRate": ((agentStatsObj.won / agentStatsObj.gamesPlayed) * 100).toFixed(3) + "%",
                "k/d/a": ((agentStatsObj.kills + agentStatsObj.assists) / (agentStatsObj.deaths === 0 ? 1 : agentStatsObj.deaths)).toFixed(3),
            };
            for (let [key, value] of Object.entries(agentStatsObj)) {
                if (typeof value === "number") {
                    statisticNameSet.add(key);
                    newTableRow[key] = value;
                }
            }
            tableRowData.current.push(newTableRow);
        }

        tableColumns.current = [];
        for (let key of Array.from(statisticNameSet.values()).sort()) {
            let column: Record<string, string | boolean | number> = {
                "field": key
            };
            if (key === "agent") {
                column["filter"] = true;
                column["pinned"] = "left";
                column["width"] = 120;
            }
            if (key === "gamesPlayed") {
                column["pinned"] = "left";
                column["width"] = 110;
            }
            if (key === "winRate") {
                column["pinned"] = "left";
            }
            if (key === "k/d/a") {
                column["pinned"] = "left";
                column["width"] = 90;
            }
            tableColumns.current.push(column);
        }
    }

    // To be updated once we can get the profile picture link from the player's matches
    let profilePictureUrl = useRef("https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-818035c4e561/smallart.png");
    let dateOfOldestMatch = useRef(new Date());
    let dateOfNewestMatch = useRef(new Date());

    useEffect(() => {
        if (player !== null && matches !== null) {
            setMatchYetToDownloadCount(player.match_ids.length - matches.length);

            console.log("Use effect triggered!")

            if (matches.length > 0) {

                // Get profile imagery from the most recent match
                const mostRecentMatch = matches[matches.length - 1];
                const playerData = mostRecentMatch.json_data.players.find((matchParticipant) => matchParticipant.puuid === player._id);
                const playerCardUUID = playerData?.player_card_id;
                profilePictureUrl.current = `https://media.valorant-api.com/playercards/${playerCardUUID}/smallart.png`

                // Get the oldest and newest match dates
                const oldestMatch = matches[0];
                const newestMatch = matches[matches.length - 1];
                dateOfOldestMatch.current = new Date(oldestMatch.json_data.info.start_millis);
                dateOfNewestMatch.current = new Date(newestMatch.json_data.info.start_millis);
            }

            calculateStatistics();
        }
    }, [player, matches, calculateStatistics]);

    function updateIdSet(set: Set<string>, id: string, isBoxChecked: boolean): Set<string> {
        // Given a set of map/queue/version IDs, update it to include or exclude the given ID
        // If isBoxChecked is true, that means we include it in the set
        // If isBoxChecked is false, that means we exclude it from the set

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

    function getMatchHistoryListing(match: ValMatch): React.ReactNode {
        // Create the HTML for a single match in the list of match history

        let playerData = match.json_data.players.find((matchParticipant) => matchParticipant.puuid === player?._id);
        let teamData = match.json_data.teams.find((team) => team.id === playerData?.team_id);
        if (playerData === undefined || teamData === undefined) {
            return <></>;
        }

        return (
            <Stack direction="column" key={match.json_data.id}>
                <Typography component="div" className="text-center">
                    {teamData.won ?
                        <span className="text-emerald-500">VICTORY</span>
                        :
                        <span className="text-red-500">DEFEAT</span>
                    }
                    {" - "}
                    {getAgentName(playerData.character_id, allValAgentInfo.current)}: {playerData.stats.kills}/{playerData.stats.deaths}/{playerData.stats.assists}
                    {" - "}
                    {getValQueueInfo(match.json_data.info.queue_id, allValQueueInfo.current).dropdownText}: {getValMapInfo(match.json_data.info.map_url, allValMapInfo.current).displayName}
                    {" - "}
                    {new Date(match.json_data.info.start_millis).toLocaleDateString()}
                    {/* TODO: Add button that you can click to see the match details in a table */}
                </Typography>
            </Stack>
        )
    }

    function getMatchHistoryListingStatsTable(match: ValMatch): React.ReactNode {
        // Create the stats table for a match in the match history listing

        let playerData = match.json_data.players.find((matchParticipant) => matchParticipant.puuid === player?._id);

        return (
            // TODO: NYI
            <></>
        )
    }

    function getRandomNumber() {
        // Returns an integer between 0 and 100
        let number = Number((Math.random() * 100).toFixed(0));
        return number;
    }

    function getConditionalS(quantity: number): string {
        // Returns "s" if the quantity is not 1, otherwise returns an empty string
        if (quantity === 1) {
            return "";
        }
        return "s";
    }

    const getFriendStats = (friendStatsObj: ValMatchStatisticsByFriend): ValMatchStatistics => {
        return statistics.current.aggregatedStatisticsForAllParticipants.get(friendStatsObj.friendPuuid) ?? new ValMatchStatistics();
    }

    return (
        <Box sx={{ flexGrow: 1, width: "100%", maxWidth: "100%" }}>
            {player !== null &&
                <>
                    {profilePictureUrl.current !== "" &&
                        <div className="pb-4 w-32 h-32 relative my-0 mx-auto">
                            <Image
                                src={profilePictureUrl.current}
                                alt="Profile picture"
                                fill
                                quality={100}
                                priority
                                sizes="100%"
                            />
                        </div>
                    }
                    <Typography variant="h3" component="h1" className="text-center pt-4">
                        {player.game_name === null ? searchedRiotId : player.game_name}
                    </Typography>
                    {matches !== null &&
                        <>
                            {matchYetToDownloadCount !== null && matchYetToDownloadCount > 0 &&
                                <Typography variant="body1" className="text-center">
                                    We currently have {matches.length} of your {player.match_ids.length} matches saved.
                                    <br />
                                    The remaining {matchYetToDownloadCount} matches will be downloaded over time. Check back later!
                                </Typography>
                            }
                            <Box sx={{ width: "100%", maxWidth: "100%" }} className="pb-8">
                                <Typography className="text-center">
                                    Processed {matches.length} games from {dateOfOldestMatch.current.toLocaleDateString()} to {dateOfNewestMatch.current.toLocaleDateString()}:
                                </Typography>
                                <Box className="text-center py-4">
                                    <Button
                                        className="bg-slate-500"
                                        variant="contained"
                                        color="primary"
                                        onClick={props.updatePlayerDataCallback}
                                        disabled={props.isCurrentlyUpdating}
                                    >
                                        {props.isCurrentlyUpdating ? <CircularProgress /> : "Update Player Data"}
                                    </Button>
                                </Box>
                                <Stack direction="column" className="pb-8">
                                    <Typography variant="h6" component="h2">
                                        Match Filters
                                    </Typography>
                                    <Typography variant="body1" component="span" className="italic">
                                        Toggle which matches contribute to your displayed statistics.
                                    </Typography>
                                </Stack>
                                <Grid className="h-60 border-2 border-white bg-gray-950 resize-y overflow-y-scroll" container spacing={3} columns={4}>
                                    <Grid item xs={1}>
                                        <FormGroup>
                                            <FormLabel component="legend" className="text-white font-bold">Map Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.mapIdPlayCount).map(mapUrl => getValMapInfo(mapUrl, allValMapInfo.current)).map(mapInfo => (
                                                <div key={mapInfo.uuid}>
                                                    <FormControlLabel
                                                        control={<Checkbox defaultChecked />}
                                                        onChange={(e) => {
                                                            let updatedMapUrlFilterSet = updateIdSet(mapUrlFilterSet, mapInfo.mapUrl, (e.target as HTMLInputElement).checked);
                                                            statistics.current.calculateStatistics(updatedMapUrlFilterSet, queueIdFilterSet, versionFilterSet);
                                                            setMapUrlFilterSet(updatedMapUrlFilterSet);
                                                            rerenderTable();
                                                        }}
                                                        // Required to index into the mapIdPlayCount object with URL because matches don't store the map ID, they store the map URL so stats are stored under the URL
                                                        label={`${mapInfo.displayName} (${statistics.current.mapIdPlayCount[mapInfo.mapUrl]} game${getConditionalS(statistics.current.mapIdPlayCount[mapInfo.mapUrl])})`}
                                                    />
                                                </div>
                                            )))}
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormGroup>
                                            <FormLabel component="legend" className="text-white font-bold">Queue Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.queueIdPlayCount).map(queueId => getValQueueInfo(queueId, allValQueueInfo.current)).map(queueInfo => (
                                                <div key={queueInfo.queueId}>
                                                    <FormControlLabel
                                                        control={<Checkbox defaultChecked />}
                                                        onChange={(e) => {
                                                            let updatedQueueIdFilterSet = updateIdSet(queueIdFilterSet, queueInfo.queueId, (e.target as HTMLInputElement).checked);
                                                            statistics.current.calculateStatistics(mapUrlFilterSet, updatedQueueIdFilterSet, versionFilterSet);
                                                            setQueueIdFilterSet(updatedQueueIdFilterSet);
                                                            rerenderTable();
                                                        }}
                                                        label={`${queueInfo.dropdownText} (${statistics.current.queueIdPlayCount[queueInfo.queueId]} game${getConditionalS(statistics.current.queueIdPlayCount[queueInfo.queueId])})`}
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
                                                            let updatedVersionFilterSet = updateIdSet(versionFilterSet, version, (e.target as HTMLInputElement).checked);
                                                            statistics.current.calculateStatistics(mapUrlFilterSet, queueIdFilterSet, updatedVersionFilterSet);
                                                            setVersionFilterSet(updatedVersionFilterSet);
                                                            rerenderTable();
                                                        }}
                                                        label={`${version} (${statistics.current.versionPlayCount[version]} game${getConditionalS(statistics.current.versionPlayCount[version])})`}
                                                    />
                                                </div>
                                            )))}
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormGroup>
                                            <FormLabel component="legend" className="text-white font-bold">Season Filters</FormLabel>
                                            {Array.from(Object.keys(statistics.current.seasonPlayCount).map(season => (
                                                <div key={season}>
                                                    <FormControlLabel
                                                        control={<Checkbox defaultChecked />}
                                                        onChange={(e) => {
                                                            let updatedSeasonFilterSet = updateIdSet(seasonFilterSet, season, (e.target as HTMLInputElement).checked);
                                                            statistics.current.calculateStatistics(mapUrlFilterSet, queueIdFilterSet, versionFilterSet, updatedSeasonFilterSet);
                                                            setSeasonFilterSet(updatedSeasonFilterSet);
                                                            rerenderTable();
                                                        }}
                                                        label={`${season} (${statistics.current.seasonPlayCount[season]} game${getConditionalS(statistics.current.seasonPlayCount[season])})`}
                                                    />
                                                </div>
                                            )))}
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="pt-8">
                                    <Grid item xs={6}>
                                        <Stack direction="column" className="text-center">
                                            <Typography variant="h4" component="span">
                                                Win Count: {statistics.current.aggregatedStatistics.won}
                                            </Typography>
                                            {getRandomNumber() % 3 === 0 ?
                                                <Typography variant="body2" component="span">
                                                    Wow!
                                                </Typography> :
                                                ""
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="column" className="text-center">
                                            <Typography variant="h4" component="span">
                                                Hours Played: {
                                                    (statistics.current.aggregatedStatistics.playtimeMillis / 1000 / 60 / 60).toFixed(3)
                                                }
                                            </Typography>
                                            {getRandomNumber() % 3 === 0 ?
                                                <Typography variant="body2" component="span">
                                                    Wow!
                                                </Typography> :
                                                ""
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="column" className="text-center">
                                            <Typography variant="h4" component="span">
                                                Kills: {statistics.current.aggregatedStatistics.kills}
                                            </Typography>
                                            {getRandomNumber() % 3 === 0 ?
                                                <Typography variant="body2" component="span">
                                                    Wow!
                                                </Typography> :
                                                ""
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="column" className="text-center">
                                            <Typography variant="h4" component="span">
                                                Total Rounds Played: {statistics.current.aggregatedStatistics.roundsPlayed}
                                            </Typography>
                                            {getRandomNumber() % 3 === 0 ?
                                                <Typography variant="body2" component="span">
                                                    Wow!
                                                </Typography> :
                                                ""
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="column" className="text-center">
                                            <Typography variant="h4" component="span">
                                                Spikes Planted: {statistics.current.aggregatedStatistics.spikesPlanted}
                                            </Typography>
                                            {getRandomNumber() % 3 === 0 ?
                                                <Typography variant="body2" component="span">
                                                    Wow!
                                                </Typography> :
                                                ""
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="column" className="text-center">
                                            <Typography variant="h4" component="span">
                                                Spikes Defused: {statistics.current.aggregatedStatistics.spikesDefused}
                                            </Typography>
                                            {getRandomNumber() % 3 === 0 ?
                                                <Typography variant="body2" component="span">
                                                    Wow!
                                                </Typography> :
                                                ""
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="column" className="text-center">
                                            <Typography variant="h4" component="span">
                                                Ultimates Used: {statistics.current.aggregatedStatistics.ultimateCasts}
                                            </Typography>
                                            {getRandomNumber() % 3 === 0 ?
                                                <Typography variant="body2" component="span">
                                                    Wow!
                                                </Typography> :
                                                ""
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="column" className="text-center">
                                            <Typography variant="h4" component="span">
                                                Aces: {statistics.current.aggregatedStatistics.aces}
                                            </Typography>
                                            {getRandomNumber() % 3 === 0 ?
                                                <Typography variant="body2" component="span">
                                                    Wow!
                                                </Typography> :
                                                ""
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="column" className="text-center">
                                            <Typography variant="h4" component="span">
                                                KDA: {
                                                    ((
                                                        statistics.current.aggregatedStatistics.kills
                                                        +
                                                        statistics.current.aggregatedStatistics.assists
                                                    )
                                                        /
                                                        (statistics.current.aggregatedStatistics.deaths === 0 ? 1 : statistics.current.aggregatedStatistics.deaths)
                                                    ).toFixed(2)
                                                }
                                            </Typography>
                                            {getRandomNumber() % 3 === 0 ?
                                                <Typography variant="body2" component="span">
                                                    Wow!
                                                </Typography> :
                                                ""
                                            }
                                        </Stack>
                                    </Grid>
                                    {statistics.current.matchStatisticsByAgent[0] !== undefined && // If there are no agents played, then this just won't show up
                                        <Grid item xs={6}>
                                            <Stack direction="column" className="text-center">
                                                <Typography variant="h4" component="span">
                                                    Most Played: {statistics.current.matchStatisticsByAgent[0].agentName} ({statistics.current.matchStatisticsByAgent[0].gamesPlayed} times)
                                                </Typography>
                                                {getRandomNumber() % 3 === 0 ?
                                                    <Typography variant="body2" component="span">
                                                        Wow!
                                                    </Typography> :
                                                    ""
                                                }
                                            </Stack>
                                        </Grid>
                                    }
                                </Grid>
                            </Box>
                            <Stack direction="column">
                                <Typography variant="h6" component="h2">
                                    Statistics Table
                                </Typography>
                                <Typography variant="body1" component="span" className="italic">
                                    View all your stats! Resize column widths, click on a column header to sort, or hover the Champion Name column header and click on the ☰ button to search.
                                </Typography>
                            </Stack>
                            <Box style={{ height: 600 }}>
                                <AgGridReact className="ag-theme-material"
                                    rowData={tableRowData.current}
                                    columnDefs={tableColumns.current}
                                    defaultColDef={defaultColDef}
                                ></AgGridReact>
                            </Box>
                            <Stack direction="column" className="pt-16">
                                <Typography variant="h6" component="h2">
                                    Your BFFs
                                </Typography>
                                <Typography variant="body1" component="span" className="italic">
                                    {"Everyone you've played a game with, ordered by most games to least games played."}
                                </Typography>
                            </Stack>
                            <Stack direction="column" className="h-96 overflow-y-scroll bg-gray-950 border-2 border-white resize-y">
                                {statistics.current.matchStatisticsByFriend.map((friendStatsObj, index) => (
                                    <Box key={index} className="py-2 text-center">
                                        <Typography component="div" className="text-blue-500 py-2 text-2xl">
                                            {`${index + 1}. `}
                                            <a
                                                href={`/val/${player.platform}/id/${friendStatsObj.friendPuuid}`}
                                                className="hover:bg-blue-500 underline rounded px-4 py-2 text-white bg-slate-800"
                                            >
                                                {`${friendStatsObj.friendName}`}
                                            </a>
                                        </Typography>
                                        <Typography variant="body1" component="div" className="text-green-300">
                                            Games Played Together: {friendStatsObj.gamesPlayed}
                                        </Typography>
                                        <Typography variant="body1" component="div" className="text-teal-500">
                                            Win Rate: {((friendStatsObj.won / friendStatsObj.gamesPlayed) * 100).toFixed(2)}%
                                        </Typography>
                                        <Box className="text-orange-500">
                                            <Typography variant="body1" component="div" className="text-orange-500">
                                                Your KDAs When Together:
                                            </Typography>
                                            <table className="mx-auto border-separate border-spacing-x-4">
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th className="font-normal">You</th>
                                                        <th className="font-normal">Them</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="font-bold">KDA</td>
                                                        <td className="font-bold">{((friendStatsObj.kills + friendStatsObj.assists) / (friendStatsObj.deaths === 0 ? 1 : friendStatsObj.deaths)).toFixed(2)}</td>
                                                        <td className="font-bold">{((getFriendStats(friendStatsObj).kills + getFriendStats(friendStatsObj).assists) / (getFriendStats(friendStatsObj).deaths === 0 ? 1 : getFriendStats(friendStatsObj).deaths)).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-normal">Kills</td>
                                                        <td className="font-normal">{friendStatsObj.kills}</td>
                                                        <td className="font-normal">{getFriendStats(friendStatsObj).kills}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-normal">Deaths</td>
                                                        <td className="font-normal">{friendStatsObj.deaths}</td>
                                                        <td className="font-normal">{getFriendStats(friendStatsObj).deaths}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="font-normal">Assists</td>
                                                        <td className="font-normal">{friendStatsObj.assists}</td>
                                                        <td className="font-normal">{getFriendStats(friendStatsObj).assists}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Box>
                                        <Stack direction="column">
                                            <Typography variant="body1" component="div">
                                                With your friend, you played {friendStatsObj.agentsPlayed.size} unique agent{getConditionalS(friendStatsObj.agentsPlayed.size)}.
                                                <br/>
                                                You really liked playing
                                                <Typography component="span" className="text-fuchsia-500">
                                                    {" " + getAgentName(getFirstElement(friendStatsObj.agentsPlayed) as string, allValAgentInfo.current) + " "}
                                                </Typography>
                                                ({friendStatsObj.agentsPlayed.get(getFirstElement(friendStatsObj.agentsPlayed) as string)} time{getConditionalS(friendStatsObj.agentsPlayed.get(getFirstElement(friendStatsObj.agentsPlayed) as string) as number)}).
                                            </Typography>
                                        </Stack>
                                        <Stack direction="column">
                                            <Typography variant="body1" component="div">
                                                With you, your friend played {getFriendStats(friendStatsObj).agentsPlayed.size} unique agent{getConditionalS(getFriendStats(friendStatsObj).agentsPlayed.size)}.
                                                <br/>
                                                They really liked playing
                                                <Typography component="span" className="text-fuchsia-500">
                                                    {" " + getAgentName(getFirstElement(getFriendStats(friendStatsObj).agentsPlayed) as string, allValAgentInfo.current) + " "}
                                                </Typography>
                                                ({getFriendStats(friendStatsObj).agentsPlayed.get(getFirstElement(getFriendStats(friendStatsObj).agentsPlayed) as string)} time{getConditionalS(getFriendStats(friendStatsObj).agentsPlayed.get(getFirstElement(getFriendStats(friendStatsObj).agentsPlayed) as string) as number)}).
                                            </Typography>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </>
                    }
                    <Stack direction="column" className="pt-8">
                        <Typography variant="h6" component="h2">
                            Match History
                        </Typography>
                        <Typography variant="body1" component="span" className="italic">
                            {"A list of every match you've played, in chronological order."}
                        </Typography>
                        <Stack direction="column">
                            {matches !== null && matches.map((match, index) => {
                                return (
                                    <Box key={index}>
                                        {getMatchHistoryListing(match)}
                                    </Box>
                                )
                            })}
                        </Stack>
                    </Stack>
                </>
            }
        </Box >
    )
}
