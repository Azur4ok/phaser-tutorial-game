import { Types } from "phaser"

export type ObjectPoint = {
  height: number
  id: number
  name: string
  point: boolean
  rotation: number
  type: string
  visible: boolean
  width: number
  x: number
  y: number
}

export enum ScoreOperations {
  INCREASE,
  DECREASE,
  SET_VALUE,
}
















export enum EVENTS_NAME {
  chestLoot = 'chest-loot',
  attack = 'attack',
  gameEnd = "gameEnd",
 
}

export enum GameStatus {
  WIN,
  LOSE,
}

export type GameConfigExtended = Types.Core.GameConfig & {
  winScore: number
}
