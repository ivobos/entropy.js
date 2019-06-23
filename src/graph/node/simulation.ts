import { SpacialObject, SpacialAspect } from "./space";
import { NodeAspect, GraphNodeProps, GraphNode, NodeAspectCtor } from "./graph-node";

export type SimulationStepFunction = (simulationTimestep: number) => void;

export interface SimulationProps {
    simulation: true;
    simulationStep: SimulationStepFunction;
}

export interface SimObject extends SpacialObject, SimulationProps {
}

export class SimulationAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return (<SimulationProps>props).simulation === true;
    }

    initGraphNode(node: GraphNode, props?: GraphNodeProps): void {
        if (props === undefined) return;
        const simObject = node as SimObject;
        const simProps = props as SimulationProps;
        simObject.simulation = true;
        simObject.simulationStep = simProps.simulationStep;
    }    

    simProcessing(simulationTimestepMsec: number, node: GraphNode, prevNode?: GraphNode): void {
        const simObject = node as SimObject;
        if (!simObject.simulation) return;
        simObject.simulationStep(simulationTimestepMsec);
    }

    simExecuteAfter(): NodeAspectCtor[] {
        return [SpacialAspect]
    }

}
