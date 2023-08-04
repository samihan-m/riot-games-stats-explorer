import { LolMatch } from "./LolMatch";
import { Participant } from "./LolMatchData";
import { Player } from "./Player";

export type PlayedChampions = Record<string, number> // champion name -> play count

export type ChampionPlayCount = {
    championName: string,
    playCount: number,
}

export function incrementChampionPlayCount(championName: string, playedChampions: PlayedChampions): PlayedChampions {
    if (championName in playedChampions) {
        playedChampions[championName] += 1;
    }
    else {
        playedChampions[championName] = 1;
    }
    return playedChampions;
}

export function getMostPlayedChampion(playedChampions: PlayedChampions): ChampionPlayCount {
    let mostPlayedChampion: ChampionPlayCount = {
        "championName": "",
        "playCount": 0
    }
    for (let championName of Object.keys(playedChampions)) {
        if (playedChampions[championName] > mostPlayedChampion.playCount) {
            mostPlayedChampion.championName = championName;
            mostPlayedChampion.playCount = playedChampions[championName];
        }
    }
    return mostPlayedChampion;
}

export function calculateKDA(kills: number, deaths: number, assists: number, precision: number = 3): number {
    let kdaDivisor = (deaths === 0) ? 1 : deaths;
    return Number(((kills + assists) / kdaDivisor).toFixed(precision));
}

export type FriendPlayedWith = {
    summonerName: string[],
    puuid: string,
    playCount: number,
    winCount: number,
    lossCount: number,
    // winRate: number,
    friendKills: number,
    friendDeaths: number,
    friendAssists: number,
    friendPlayed: PlayedChampions,
    yourKills: number,
    yourDeaths: number,
    yourAssists: number,
    youPlayed: PlayedChampions,
}

export function getFriendObject(puuid: string, friends: FriendPlayedWith[]): FriendPlayedWith {
    for (let friendObj of friends) {
        if (friendObj.puuid === puuid) {
            return friendObj;
        }
    }
    let newFriendObject = structuredClone(defaultFriendObject);
    newFriendObject.puuid = puuid;
    friends.push(newFriendObject);
    return newFriendObject;
}

export let defaultFriendObject: FriendPlayedWith = {
    summonerName: [],
    puuid: "",
    playCount: 0,
    winCount: 0,
    lossCount: 0,
    // winRate: 0,
    friendKills: 0,
    friendDeaths: 0,
    friendAssists: 0,
    friendPlayed: {},
    yourKills: 0,
    yourDeaths: 0,
    yourAssists: 0,
    youPlayed: {},
}

type ChampionStatistics = Record<string, string | number>

export class LolStatistics {
    mapIdPlayCount: Record<number, number>;
    queueIdPlayCount: Record<number, number>;
    modePlayCount: Record<string, number>;
    typePlayCount: Record<string, number>;
    versionPlayCount: Record<string, number>;
    totalWinCount: number;
    totalMinionsSlain: number;
    totalFirstBloods: number;
    totalVisionScore: number;
    longestKillingSpree: number;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    totalKDA: number;
    playedChampions: PlayedChampions;
    pentakillCount: number;
    friendsPlayedWith: FriendPlayedWith[];
    earliestGameTime: number;
    latestGameTime: number;

    allChampionSpecificStatistics: ChampionStatistics[];

    constructor(player: Player | null, lolMatches: LolMatch[] | null) {
        this.mapIdPlayCount = {};
        this.queueIdPlayCount = {};
        this.modePlayCount = {};
        this.typePlayCount = {};
        this.versionPlayCount = {};
        this.totalWinCount = 0;
        this.totalMinionsSlain = 0;
        this.totalFirstBloods = 0;
        this.totalVisionScore = 0;
        this.longestKillingSpree = 0;
        this.totalKills = 0;
        this.totalDeaths = 0;
        this.totalAssists = 0;
        this.totalKDA = 0;
        this.playedChampions = {};
        this.pentakillCount = 0;
        this.friendsPlayedWith = [];
        this.earliestGameTime = 8640000000000000; // Maximum date (as per https://stackoverflow.com/a/43794682)
        this.latestGameTime = -8640000000000000; // Minimum date (as per https://stackoverflow.com/a/43794682)
        this.allChampionSpecificStatistics = [];

        if (player === null || lolMatches === null) {
            return;
        }

        console.log("Constructed statistics object, calculating...")
        this.calculateStatistics(player, lolMatches);
    }

    resetStatistics() {
        console.log("Resetting statistics");

        this.mapIdPlayCount = {};
        this.queueIdPlayCount = {};
        this.modePlayCount = {};
        this.typePlayCount = {};
        this.versionPlayCount = {};
        this.totalWinCount = 0;
        this.totalMinionsSlain = 0;
        this.totalFirstBloods = 0;
        this.totalVisionScore = 0;
        this.longestKillingSpree = 0;
        this.totalKills = 0;
        this.totalDeaths = 0;
        this.totalAssists = 0;
        this.totalKDA = 0;
        this.playedChampions = {};
        this.pentakillCount = 0;
        this.friendsPlayedWith = [];
        this.earliestGameTime = 8640000000000000; // Maximum date (as per https://stackoverflow.com/a/43794682)
        this.latestGameTime = -8640000000000000; // Minimum date (as per https://stackoverflow.com/a/43794682)
        this.allChampionSpecificStatistics = [];
    }

    calculateStatistics(
        player: Player,
        lolMatches: LolMatch[],
        mapIdFilter: Set<number> | null = null,
        queueIdFilter: Set<number> | null = null,
        modeFilter: Set<string> | null = null,
        typeFilter: Set<string> | null = null,
        versionFilter: Set<string> | null = null
    ) {
        console.log("Calculating statistics...")

        this.resetStatistics();

        let prototypeChampionsStatsObject: ChampionStatistics = {
            "championName": "",
            "gamesPlayed": 0,
            "k/d/a": 0.0,
        }

        let aggregatedChampionStatisticsObject = structuredClone(prototypeChampionsStatsObject);
        aggregatedChampionStatisticsObject.championName = "Total";
        this.allChampionSpecificStatistics.push(aggregatedChampionStatisticsObject);

        function getChampStatsObject(championName: string, allChampionStatisticObjects: ChampionStatistics[]): ChampionStatistics {
            for (let obj of allChampionStatisticObjects) {
                if (obj.championName === championName) {
                    return obj;
                }
            }
            let newObj = structuredClone(prototypeChampionsStatsObject);
            allChampionStatisticObjects.push(newObj);
            newObj.championName = championName;
            return newObj;
        }
    
        for (let match of lolMatches) {

            // Notice any broken matches (see: May 12th-13th connection issues leading to incomplete match objects being stored in match histories)
            if(match.json_data.info === undefined) {
                continue;
            }

            let mapId = match.json_data.info.map_id;
            let queueId = match.json_data.info.queue_id;
            let mode = match.json_data.info.mode;
            let type = match.json_data.info.type;
            let version = match.json_data.info.version;

            this.mapIdPlayCount[mapId] = (this.mapIdPlayCount[mapId] === undefined ? 0 : this.mapIdPlayCount[mapId]) + 1;

            this.queueIdPlayCount[queueId] = (this.queueIdPlayCount[queueId] === undefined ? 0 : this.queueIdPlayCount[queueId]) + 1;

            this.modePlayCount[mode] = (this.modePlayCount[mode] === undefined ? 0 : this.modePlayCount[mode]) + 1;

            this.typePlayCount[type] = (this.typePlayCount[type] === undefined ? 0 : this.typePlayCount[type]) + 1;

            this.versionPlayCount[version] = (this.versionPlayCount[version] === undefined ? 0 : this.versionPlayCount[version]) + 1;

            if (mapIdFilter?.has(mapId) === true) {
                continue;
            }
            if (queueIdFilter?.has(queueId) === true) {
                continue;
            }
            if (modeFilter?.has(mode) === true) {
                continue;
            }
            if (typeFilter?.has(type) === true) {
                continue;
            }
            if (versionFilter?.has(version) === true) {
                continue;
            }

            let matchStartMillis = match.json_data.info.start_millis;
            if (matchStartMillis <= this.earliestGameTime) {
                this.earliestGameTime = matchStartMillis;
            }

            if (matchStartMillis >= this.latestGameTime) {
                this.latestGameTime = matchStartMillis;
            }

            let playerInformation: Participant | null = null;
            for (let participant of match.json_data.info.participants) {
                if (participant.puuid === player._id) {
                    playerInformation = participant;
                }
            }
            playerInformation = playerInformation as Participant;


            // Update champion specific statistics

            let championStatisticsObject = getChampStatsObject(playerInformation.champion_name, this.allChampionSpecificStatistics);
            (championStatisticsObject.gamesPlayed as number) += 1;
            (aggregatedChampionStatisticsObject.gamesPlayed as number) += 1;
            for(let entry of Object.entries(playerInformation)) {
                const [statName, statValue] = entry;
                if(typeof(statValue) === "string") {
                    continue;
                }
                
                if(statName in championStatisticsObject === false) {
                    championStatisticsObject[statName] = 0;
                }
                (championStatisticsObject[statName] as number) += Number(statValue);

                if(statName in aggregatedChampionStatisticsObject === false) {
                    aggregatedChampionStatisticsObject[statName] = 0;
                }
                (aggregatedChampionStatisticsObject[statName] as number) += Number(statValue);
            }
            championStatisticsObject["winRate"] = ((championStatisticsObject["win"] as number)/(championStatisticsObject.gamesPlayed as number)* 100).toFixed(2);
            aggregatedChampionStatisticsObject["winRate"] = ((aggregatedChampionStatisticsObject["win"] as number)/(aggregatedChampionStatisticsObject.gamesPlayed as number)* 100).toFixed(2);
            

            // Update overall player statistics

            if (playerInformation.win === true) {
                this.totalWinCount += 1;
            }

            this.totalMinionsSlain += playerInformation.total_minions_killed;

            if (playerInformation.first_blood_kill === true) {
                this.totalFirstBloods += 1;
            }

            this.totalVisionScore += playerInformation.vision_score;

            if (playerInformation.largest_killing_spree > this.longestKillingSpree) {
                this.longestKillingSpree = playerInformation.largest_killing_spree;
            }

            this.totalKills += playerInformation.kills;
            this.totalDeaths += playerInformation.deaths;
            this.totalAssists += playerInformation.assists;

            this.playedChampions = incrementChampionPlayCount(playerInformation.champion_name, this.playedChampions);

            this.pentakillCount += playerInformation.penta_kills;

            let playerTeamId = playerInformation.team_id;
            let allyParticipants: Participant[] = [];
            for (let participant of match.json_data.info.participants) {
                if (participant.team_id === playerTeamId && participant.puuid !== player._id) {
                    allyParticipants.push(participant);
                }
            }
            for (let allyParticipant of allyParticipants) {
                let friend = getFriendObject(allyParticipant.puuid, this.friendsPlayedWith);
                if (friend.summonerName.includes(allyParticipant.summoner_name) === false) {
                    friend.summonerName.push(allyParticipant.summoner_name);
                }
                friend.playCount += 1;

                if (playerInformation.win === true) {
                    friend.winCount += 1;
                }
                else {
                    friend.lossCount += 1;
                }

                friend.yourKills += playerInformation.kills;
                friend.yourDeaths += playerInformation.deaths;
                friend.yourAssists += playerInformation.assists;
                friend.friendKills += allyParticipant.kills;
                friend.friendDeaths += allyParticipant.deaths;
                friend.friendAssists += allyParticipant.assists;
                friend.youPlayed = incrementChampionPlayCount(playerInformation.champion_name, friend.youPlayed);
                friend.friendPlayed = incrementChampionPlayCount(allyParticipant.champion_name, friend.friendPlayed);
            }

        }

        this.totalKDA = calculateKDA(this.totalKills, this.totalDeaths, this.totalAssists);

        // Calculate KDA for every champion object and add it t the object
        for (let champion of this.allChampionSpecificStatistics) {
            champion["k/d/a"] = calculateKDA(champion.kills as number, champion.deaths as number, champion.assists as number);
        }

        this.friendsPlayedWith.sort((a, b) => (a.playCount > b.playCount) ? -1 : 1);

        this.allChampionSpecificStatistics.sort((a, b) => (b.gamesPlayed as number) - (a.gamesPlayed as number));
    }

}
