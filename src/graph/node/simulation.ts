import { NodeWithEdges } from "./node-edges";
import { NodeAspect, GraphNodeProps, GraphNode } from "./graph-node";

export type SimulationStepFunction = (simulationTimestep: number) => void;

export interface SimulationProps {
    simulation: true;
    simulationStep: SimulationStepFunction;
}

export interface SimObject extends NodeWithEdges, SimulationProps{
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

    simProcessing(node: GraphNode, simulationTimestepMsec: number): void {
        const simObject = node as SimObject;
        if (!simObject.simulation) return;
        simObject.simulationStep(simulationTimestepMsec);
    }

}
