import { GameState } from "./types";

export interface Strategy {
  nextMove(gameState: GameState): MoveResponse;
}

export type DirectionResult = {
  direction: Direction;
  outcome: Outcome;
  otherData: number; // Used for food priority
  healthAfterMove: number; // Health after the move
  collisionPenalty: number; // Penalty for colliding with other snakes
  distanceToFood: number; // Distance to the closest food
  canTouchHead: boolean;
};

export interface Coordinate {
  x: number;
  y: number;
}
