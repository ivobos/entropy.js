import { NodeAspect, GraphNodeProps, GraphNode } from "./graph-node";

export type ProcessInputFunction = (timestamp: number, frameDelta: number) => void;

export interface InputHandlingProps {
    input: true
    processInput: ProcessInputFunction
}

export interface InputHandlingObject extends InputHandlingProps {

}

export class InputHandlingAspect implements NodeAspect {

    isAspectProps(props: GraphNodeProps): boolean {
        return (<InputHandlingProps>props).input === true;
    }

    initGraphNode(node: GraphNode, props?: GraphNodeProps): void {
        if (props === undefined) return;
        const inputHandlingObject = node as InputHandlingObject;
        const inputHandlingProps = props as InputHandlingProps;
        inputHandlingObject.input = true;
        inputHandlingObject.processInput = inputHandlingProps.processInput;
    }    

    inputProcessingVisitor(node: GraphNode, timestamp: number, frameDelta: number): void {
        const inputHandlingObject = node as InputHandlingObject;
        if (!inputHandlingObject.input) return;
        inputHandlingObject.processInput(timestamp, frameDelta);
    }

}

