import { ValQueueInfo } from "./ValQueueInfo";

// Obtained from https://valorant-api.com/v1/gamemodes/queues

export const defaultValQueueInfo: ValQueueInfo[] = [
    {
        "uuid": "d2faff85-4964-f52e-b6b5-73a5d66ccad6",
        "queueId": "competitive",
        "displayName": null,
        "description": "Standard VALORANT gameplay. Same rules as unrated, but a higher stakes mode where you earn and compete for rank.",
        "dropdownText": "Competitive",
        "selectedText": "COMPETITIVE",
        "isBeta": false,
        "displayIcon": null,
        "assetPath": "ShooterGame/Content/GameModes/Queues/CompetitiveQueue_DataAsset"
    },
    {
        "uuid": "63d60a3e-4838-695d-9077-e9af5ed523ca",
        "queueId": "custom",
        "displayName": null,
        "description": null,
        "dropdownText": "Custom Game",
        "selectedText": "CUSTOM",
        "isBeta": false,
        "displayIcon": null,
        "assetPath": "ShooterGame/Content/GameModes/Queues/CustomQueue_DataAsset"
    },
    {
        "uuid": "f3126c5e-4a6c-1f02-b216-cb9bf58df856",
        "queueId": "deathmatch",
        "displayName": null,
        "description": "A quick free for all deathmatch that's great for practicing VALORANT gunplay. No abilities, first to 40 kills wins.",
        "dropdownText": "Deathmatch",
        "selectedText": "DEATHMATCH",
        "isBeta": false,
        "displayIcon": null,
        "assetPath": "ShooterGame/Content/GameModes/Queues/DeathmatchQueue_DataAsset"
    },
    {
        "uuid": "3652def6-48fa-b868-61cc-d29702fc5dfa",
        "queueId": "ggteam",
        "displayName": null,
        "description": "In this quick team deathmatch mode, race through a series of 12 weapons and abilities with your team. First team to complete the final level wins.",
        "dropdownText": "Escalation",
        "selectedText": "ESCALATION",
        "isBeta": false,
        "displayIcon": null,
        "assetPath": "ShooterGame/Content/GameModes/Queues/GunGameTeamsQueue_DataAsset"
    },
    {
        "uuid": "1400f385-4905-96ff-8e1e-f8a4acb8c64d",
        "queueId": "hurm",
        "displayName": null,
        "description": "In this ability-enabled team deathmatch game mode, race to be the first team to 100 kills.",
        "dropdownText": "Team Deathmatch",
        "selectedText": "TEAM DEATHMATCH",
        "isBeta": false,
        "displayIcon": null,
        "assetPath": "ShooterGame/Content/GameModes/Queues/HurmQueue_DataAsset"
    },
    {
        "uuid": "6ca8aa97-413c-241b-8927-d5bd1661c1d4",
        "queueId": "newmap",
        "displayName": "Sunset",
        "description": "First to 5 rounds wins. Standard VALORANT gameplay with a streamlined economy.",
        "dropdownText": "Sunset",
        "selectedText": "SUNSET",
        "isBeta": false,
        "displayIcon": null,
        "assetPath": "ShooterGame/Content/GameModes/Queues/NewMapQueue_DataAsset"
    },
    {
        "uuid": "b1983fc3-4594-ce27-cfa8-8eb2a9b93018",
        "queueId": "onefa",
        "displayName": null,
        "description": "Same rules as unrated, but all players on the same team are the same agent. Set credits per round, first to 5 rounds wins.",
        "dropdownText": "Replication",
        "selectedText": "REPLICATION",
        "isBeta": false,
        "displayIcon": null,
        "assetPath": "ShooterGame/Content/GameModes/Queues/OneForAllQueue_DataAsset"
    },
    {
        "uuid": "16e37ed6-4654-830e-a5bb-3ead9b517122",
        "queueId": "premier",
        "displayName": null,
        "description": null,
        "dropdownText": "Premier",
        "selectedText": "PREMIER",
        "isBeta": false,
        "displayIcon": null,
        "assetPath": "ShooterGame/Content/GameModes/Queues/PremierQueue_DataAsset"
    },
    {
        "uuid": "154239f3-470c-612c-dd46-7db11282f208",
        "queueId": "snowball",
        "displayName": null,
        "description": "Launch snowballs, open presents, and ice skate in this fast festive 5v5 team deathmatch. No abilities, first to 50 kills wins.",
        "dropdownText": "Snowball Fight",
        "selectedText": "SNOWBALL FIGHT",
        "isBeta": false,
        "displayIcon": null,
        "assetPath": "ShooterGame/Content/GameModes/Queues/SnowballQueue_DataAsset"
    },
    {
        "uuid": "3938d5da-43bf-1e8c-f09f-858caf145975",
        "queueId": "spikerush",
        "displayName": null,
        "description": "Shorter, lower stakes VALORANT gameplay. Same rules as unrated with added powerup orbs and randomized weapon loadouts. First to 4 rounds wins.",
        "dropdownText": "Spike Rush",
        "selectedText": "SPIKE RUSH",
        "isBeta": false,
        "displayIcon": null,
        "assetPath": "ShooterGame/Content/GameModes/Queues/SpikeRushQueue_DataAsset"
    },
    {
        "uuid": "2d257217-464c-7c4b-efc6-51a55365d44a",
        "queueId": "swiftplay",
        "displayName": "Swiftplay",
        "description": "First to 5 rounds wins. Standard VALORANT gameplay with a streamlined economy.",
        "dropdownText": "Swiftplay",
        "selectedText": "SWIFTPLAY",
        "isBeta": false,
        "displayIcon": "https://media.valorant-api.com/gamemodequeues/2d257217-464c-7c4b-efc6-51a55365d44a/displayicon.png",
        "assetPath": "ShooterGame/Content/GameModes/Queues/SwiftplayQueue_DataAsset"
    },
    {
        "uuid": "494b69f1-4e3a-1b03-c2cd-a4875d6e9cb6",
        "queueId": "unrated",
        "displayName": null,
        "description": "Standard VALORANT gameplay. Swap between attacking and defending sites, first to 13 rounds wins.",
        "dropdownText": "Unrated",
        "selectedText": "UNRATED",
        "isBeta": false,
        "displayIcon": null,
        "assetPath": "ShooterGame/Content/GameModes/Queues/UnratedQueue_DataAsset"
    }
]