import { coordInDirection, isOutside } from "../functions/BoardFunctions";
import { Direction, Outcome } from "../types/strategy";
import { Coordinate, DirectionResult, Strategy } from "../types/strategyTypes";
import { GameState, MoveResponse } from "../types/types";

export class BasicStrategy implements Strategy {
  private healthThreshold: number = 30; // Health threshold for prioritizing food

  nextMove(gameState: GameState): MoveResponse {
    const head = gameState.you.body[0];
    const health = gameState.you.health;

    // Evaluate all possible directions
    const directionResults: Array<DirectionResult> = Object.values(
      Direction
    ).map((direction: Direction) => {
      const nextCoord = coordInDirection(head, direction);

      // Check if the next coordinate is out of bounds
      const isOutOfBounds = isOutside(nextCoord, gameState.board);
      if (isOutOfBounds) {
        return {
          direction,
          outcome: Outcome.DEAD,
          otherData: 0,
          healthAfterMove: health,
          collisionPenalty: 0,
          distanceToFood: Infinity,
          canTouchHead: false,
        };
      }

      // Check for self-collision
      const isSelfCollision = gameState.you.body.some(
        (segment) => segment.x === nextCoord.x && segment.y === nextCoord.y
      );
      if (isSelfCollision) {
        return {
          direction,
          outcome: Outcome.DEAD,
          otherData: 0,
          healthAfterMove: health,
          collisionPenalty: 0,
          distanceToFood: Infinity,
          canTouchHead: false,
        };
      }

      // Check for collision with other snakes' heads
      const otherSnake = gameState.board.snakes.find((snake) => {
        return (
          snake.body[0].x === nextCoord.x && snake.body[0].y === nextCoord.y
        ); // Check for head
      });

      let outcome = Outcome.ALIVE;
      let collisionPenalty = 0;

      // Handle collision with competitor's head
      if (otherSnake) {
        if (gameState.you.body.length > otherSnake.length) {
          // Only allow touching the head if the snake is longer
          collisionPenalty = 0; // No penalty for eating
        } else {
          outcome = Outcome.DEAD; // Cannot move into a longer snake's head
        }
      }

      // Check for collision with any segment of other snakes' bodies
      const collisionWithOtherSnakeBody = gameState.board.snakes.some(
        (snake) => {
          return snake.body
            .slice(1)
            .some(
              (segment) =>
                segment.x === nextCoord.x && segment.y === nextCoord.y
            ); // Avoid body segments
        }
      );

      if (collisionWithOtherSnakeBody) {
        outcome = Outcome.DEAD; // Cannot move into another snake's body
      }

      // Check for food consumption
      const isFood = gameState.board.food.some(
        (food) => food.x === nextCoord.x && food.y === nextCoord.y
      );
      const healthAfterMove = isFood ? health : health - 1; // If eating food, health doesn't decrease

      return {
        direction,
        outcome,
        otherData: isFood ? 5 : 0, // High weight for food
        healthAfterMove,
        collisionPenalty,
        distanceToFood: this.getClosestFoodDistance(
          nextCoord,
          gameState.board.food
        ),
        canTouchHead: otherSnake
          ? gameState.you.body.length > otherSnake.length
          : false, // Ensure it's a boolean
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
      return { move: "down" }; // Default move if no safe options
    }

    // Sort safe moves, prioritizing food and avoiding collisions
    const nextMove = safeMoves.sort((a, b) => {
      const foodWeightA =
        health < this.healthThreshold ? a.otherData + 3 : a.otherData; // Increased weight if health is low
      const foodWeightB =
        health < this.healthThreshold ? b.otherData + 3 : b.otherData;

      // Prioritize touching head if possible
      if (a.canTouchHead && !b.canTouchHead) return -1;
      if (!a.canTouchHead && b.canTouchHead) return 1;

      // Prioritize food first
      if (foodWeightB !== foodWeightA) {
        return foodWeightB - foodWeightA;
      }
      // Apply collision penalties
      return (
        a.collisionPenalty - b.collisionPenalty ||
        a.distanceToFood - b.distanceToFood
      );
    })[0];

    console.log(`MOVE ${gameState.turn}: ${nextMove.direction}`);
    return { move: nextMove.direction.toLowerCase() };
  }

  // Helper function to calculate the distance to the closest food
  private getClosestFoodDistance(
    coord: Coordinate,
    foodArray: Coordinate[]
  ): number {
    return foodArray.reduce((closest, food) => {
      const distance = Math.abs(coord.x - food.x) + Math.abs(coord.y - food.y);
      return distance < closest ? distance : closest;
    }, Infinity);
  }
}
