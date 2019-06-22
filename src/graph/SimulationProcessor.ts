
import { AbstractComponent } from "../container/AbstractComponent";
import { GraphManager } from "./GraphManager";
import { ComponentOptions } from "../container/Component";
import { FunctionGraphOperation } from "./graph-operation";
import { getUpdateVelocityAndPositionVisitor, addCollisionForces } from "./node/physics";
import { Monitor } from "../observability/Monitor";
import { GravityGraphBalancer } from "./node/gravity";

export type SimulationFunction = (simulationTimestepMsec: number) => void;

export class SimulationProcessor extends AbstractComponent {

    private simulationFunctions: SimulationFunction[] = [];
    // nodeReparenter = new NodeReparenter();  
    gravityGraphBalancer = new GravityGraphBalancer();

    constructor(options: ComponentOptions) {
        super({...options, key: SimulationProcessor});
    }

    init(): void {
        this.resolve(Monitor).addMonitorEntry({ 
            name: this.constructor.name, 
            infoContent:  () => "",
        });
    }

    registerHandler(handler: SimulationFunction): void {
        this.simulationFunctions.push(handler);
    }

    processSimulationStep(simulationTimestepMsec: number): void {
        const graphManager = this.resolve(GraphManager);

        graphManager.executeSimulationStep(simulationTimestepMsec);

        graphManager.accept(new FunctionGraphOperation(addCollisionForces));
        graphManager.accept(new FunctionGraphOperation(getUpdateVelocityAndPositionVisitor(simulationTimestepMsec)));

        // restructure graph such that parents are always the heavier objects with the most gravitational influence on objects
        this.gravityGraphBalancer.balanceOne(graphManager);

        for (const simulationFunction of this.simulationFunctions) {
            simulationFunction(simulationTimestepMsec);
        }

        graphManager.removeScheduledEntities();
    }

}
