
import { AbstractComponent } from "../container/AbstractComponent";
import { GraphManager } from "../graph/GraphManager";
import { ComponentOptions } from "../container/Component";
import { FunctionGraphOperation } from "../graph/graph-operation";
import { updateBoundingRadius } from "../graph/node/object/concerns/collision";
import { updatePositionVisitor, resetForceVector, addGravityForce, getUpdateVelocityAndPositionVisitor, addCollisionForces, GravityGraphBalancer } from "../graph/node/object/concerns/physics";
import { getUpdSimStepVisitor } from "../graph/node/object/concerns/simulation";
import { Monitor } from "../observability/Monitor";

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
        graphManager.accept(new FunctionGraphOperation(getUpdSimStepVisitor(simulationTimestepMsec)));
        graphManager.accept(new FunctionGraphOperation(updatePositionVisitor));
        graphManager.accept(new FunctionGraphOperation(resetForceVector));
        graphManager.accept(new FunctionGraphOperation(addGravityForce));
        graphManager.accept(new FunctionGraphOperation(addCollisionForces));
        graphManager.accept(new FunctionGraphOperation(getUpdateVelocityAndPositionVisitor(simulationTimestepMsec)));

        // restructure graph such that parents are always the heavier objects with the most gravitational influence on objects
        this.gravityGraphBalancer.balanceOne(graphManager);

        for (const simulationFunction of this.simulationFunctions) {
            simulationFunction(simulationTimestepMsec);
        }
        // TODO: traversin this way will not update bounding radius correcly, we have to update it for all'
        // children first and then parents
        this.resolve(GraphManager).accept(new FunctionGraphOperation(updateBoundingRadius));

        graphManager.removeScheduledEntities();
    }

}
