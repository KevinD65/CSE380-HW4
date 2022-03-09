import StateMachineGoapAI from "../../../Wolfie2D/AI/StateMachineGoapAI";
import GoapAction from "../../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import EnemyAI from "../EnemyAI";

// HOMEWORK 4 - TODO (DONE)
/**
 * Implement berserk action so that the enemy gains 1.5x speed, 2x damage, and has a 2x lower cooldown on attacking.
 * Note that you'll also need to manage how enemies use this action in the initializeEnemies method in hw4_scene.
 */
export default class Berserk extends GoapAction {
    protected emitter: Emitter;
    
    constructor(cost: number, preconditions: Array<string>, effects: Array<string>, options?: Record<string, any>) {
        super();
        this.cost = cost;
        this.preconditions = preconditions;
        this.effects = effects;
    }

    performAction(statuses: Array<string>, actor: StateMachineGoapAI, deltaT: number, target?: StateMachineGoapAI): Array<string> {
        if (this.checkPreconditions(statuses)){
            let enemy = <EnemyAI>actor;

            //If the player is out of sight, don't bother attacking
            if (enemy.getPlayerPosition() == null){
                return null;
            }
            
            //ENHANCE THE ENEMY SPEED, DAMAGE, AND COOLDOWN
            enemy.speed = 1.5 * enemy.speed;
            enemy.weapon.type.damage = enemy.weapon.type.damage * 2;
            enemy.weapon.type.cooldown = enemy.weapon.type.cooldown/2;

            //Randomize attack direction, gives the enemy gun users stormtrooper aim
            let dir = enemy.getPlayerPosition().clone().sub(enemy.owner.position).normalize();
            dir.rotateCCW(Math.PI / 4 * Math.random() - Math.PI/8);
            if(enemy.weapon.use(enemy.owner, "enemy", dir)){
                // If we fired, face that direction
                enemy.owner.rotation = Vec2.UP.angleToCCW(dir);
            }
            
            return this.effects;
        }
        return null;
    }

    updateCost(options: Record<string, number>): void {}
    
    toString(): string {
        return "(Berserk)";
    }
    
}