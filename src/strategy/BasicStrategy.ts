import { coordInDirection, isOutside } from "../functions/BoardFunctions";
import { Direction, Outcome } from "../types/strategy";
import { DirectionResult, Strategy } from "../types/strategyTypes";
import { GameState, MoveResponse } from "../types/types";

export class BasicStrategy implements Strategy {
  // Define a health threshold
  private healthThreshold: number = 30; // Adjust this value as needed

  nextMove(gameState: GameState): MoveResponse {
    const head = gameState.you.body[0];
    const health = gameState.you.health;

    // Evaluate all possible directions
    const directionResults: Array<DirectionResult> = Object.values(
      Direction
    ).map((direction: Direction) => {
      const nextCoord = coordInDirection(head, direction);
      const isOutOfBounds = isOutside(nextCoord, gameState.board);
      const isSelfCollision = gameState.you.body.some(
        (segment) => segment.x === nextCoord.x && segment.y === nextCoord.y
      );
      const otherSnake = gameState.board.snakes.find((snake) => {
        return (
          snake.body[0].x === nextCoord.x && snake.body[0].y === nextCoord.y
        );
      });

      let outcome = Outcome.ALIVE;

      if (isOutOfBounds || isSelfCollision) {
        outcome = Outcome.DEAD;
      } else if (otherSnake) {
        // Handle head-to-head collision
        if (otherSnake.length >= gameState.you.body.length) {
          outcome = Outcome.DEAD;
        }
      }

      // Check for food consumption
      const isFood = gameState.board.food.some(
        (food) => food.x === nextCoord.x && food.y === nextCoord.y
      );
      const healthAfterMove = isFood ? health : health - 1; // If eating food, health doesn't decrease

      return {
        direction,
        outcome,
        otherData: isFood ? 2 : 0, // Higher weight for food
        healthAfterMove,
      };
    });

    // Filter for safe moves
    const safeMoves = directionResults.filter(
      ({ outcome }) => outcome === Outcome.ALIVE
    );

    // Check if there are no safe moves
    if (safeMoves.length === 0) {
      console.log(
        `MOVE ${gameState.turn}: No safe moves detected! Moving down`
      );
      return { move: "down" };
    }

    // Sort safe moves, prioritizing food and health
    const nextMove = safeMoves.sort((a, b) => {
      // Adjust food weighting based on health threshold
      const foodWeightA =
        health < this.healthThreshold ? a.otherData + 1 : a.otherData; // Increase weight if health is low
      const foodWeightB =
        health < this.healthThreshold ? b.otherData + 1 : b.otherData;

      // Prioritize food first
      if (foodWeightB !== foodWeightA) {
        return foodWeightB - foodWeightA;
      }
      // Then prioritize health
      return b.healthAfterMove - a.healthAfterMove;
    })[0];

    console.log(`MOVE ${gameState.turn}: ${nextMove.direction}`);
    return { move: nextMove.direction.toLowerCase() };
  }
}
