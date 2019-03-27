import { ComponentOptions } from "../container/Component";
import { AbstractObservableComponent } from "../container/AbstractObservableComponent";
import { GlobalKeyboardHandler } from "../input/GlobalKeyboardHandler";
import { Monitor } from "../observability/Monitor";
import { HtmlElements } from "./HtmlElements";

export interface LoopStartStep {

    loopStartStep(timestamp: number, frameDelta: number ): void;

}

export interface SimStep {

    // update simulation (physics and ai)
    simStep(simulationTimestepMsec: number): void;

}

export interface BeforeDrawStep {

    // prepare to render visuals
    beforeDrawStep(interpolationPercentage: number): void;

}


export interface DrawStep {

    // render visuals
    drawStep(interpolationPercentage: number): void;

}

export interface LoopEndStep {

    // end of game loop, called once
    loopEndStep(fps: number, panic: boolean): void;

}


/**
 * Converted to ts from https://github.com/IceCreamYou/MainLoop.js/blob/gh-pages/src/mainloop.js
 */
export class MainLoop extends AbstractObservableComponent  {

    private simulationTimestep = 1000 / 60; // simulation time size
    private gameClockMultiplier = 1.;
    private rafHandle: number = 0;
    private lastFrameTimeMs: number = 0; // time of last execution of loop
    private minFrameDelay: number = 0;
    private frameDelta: number = 0;
    private lastFpsUpdate: number = 0; // timestamp of fps moving average update
    private fpsUpdateInterval: number = 1000; // minimum duration between fps update
    private fps: number = 60; // exponential moving average of frames per second
    private fpsAlpha = 0.9; // how heavily to weigh recent fps measurements
    private framesSinceLastFpsUpdate = 0; // frames since last fps update
    private numUpdateSteps = 0; // number of times simulatio needs to update
    private panic: boolean = false; // is simulation too far behind
    private started: boolean = false; // has loop started
    private running: boolean = false; // once loop has drawn its considered running
    private loopStartSteps: LoopStartStep[] = [];
    private simSteps: SimStep[] = [];
    private beforeDrawSteps: BeforeDrawStep[] = [];
    private drawSteps: DrawStep[] = [];
    private loopEndSteps: LoopEndStep[] = [];
    private simPause: boolean = false;

    constructor(options: ComponentOptions) {
        super({...options, key: MainLoop, obsDetail: () => this.getAdditionalMonitorText()});
    }
    
    init(): void {
        super.init();
        this.resolve(Monitor).register(this);
        const mainLoop = this.resolve(MainLoop);
        const keyboard = this.resolve(GlobalKeyboardHandler);
        // TODO: should reduce fps limit when window loses focus, see https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
        keyboard.registerKey('-', () => mainLoop.updateClockMultiplier(.5));
        keyboard.registerKey('=', () => mainLoop.updateClockMultiplier(2.));
        keyboard.registerKey('p', () => mainLoop.togglePauseSimulation());
    }

    togglePauseSimulation(): void {
        this.simPause = !this.simPause;
        this.resolve(HtmlElements).showSimPausedText(this.simPause);
    }

    getAdditionalMonitorText(): string {
        return "FPS: "+this.getFPS().toFixed(1);
    }
            
    // how many milliseconds to simulate by execution of update
    getSimulationTimestep() {
        return this.simulationTimestep;
    }

    // set how many milliseconds to simulate by execution of update
    setSimulationTimestep(timestep: number) {
        this.simulationTimestep = timestep;
        return this;
    }

    // exponential moving average of frames per second
    getFPS(): number {
        return this.fps;
    }

    // what is maximum framerate
    getMaxAllowedFPS(): number {
        return 1000 / this.minFrameDelay;
    }

    // set maximum fps
    setMaxAllowedFPS(fps: number) {
        if (typeof fps === 'undefined') {
            fps = Infinity;
        }
        if (fps === 0) {
            this.stop();
        }
        else {
            // Dividing by Infinity returns zero.
            this.minFrameDelay = 1000 / fps;
        }
        return this;
    }
    // resets amount of time not yet simulated to 0
    resetFrameDelta() {
        var oldFrameDelta = this.frameDelta;
        this.frameDelta = 0;
        return oldFrameDelta;
    }
    // add simulation module
    addLoopStartStep(loopStartStep: LoopStartStep) {
        this.loopStartSteps.push(loopStartStep);
    }
    addSimStep(simUpdate: SimStep) {
        this.simSteps.push(simUpdate);
    }
    addBeforeDrawStep(beforeDrawStep: BeforeDrawStep) {
        this.beforeDrawSteps.push(beforeDrawStep);
    }
    addDrawStep(drawStep: DrawStep) {
        this.drawSteps.push(drawStep);
    }
    addLoopEndStep(loopEndStep: LoopEndStep) {
        this.loopEndSteps.push(loopEndStep);
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.rafHandle = requestAnimationFrame(this.startCallback.bind(this));
        }
        return this;
    }
    startCallback(timestamp: number) {
        // Render the initial state before any updates occur.
        // this.draw(1);
        for (const drawStep of this.drawSteps) {
            drawStep.drawStep(1);
        }
        // application starts drawing.
        this.running = true;
        // Reset variables that are used for tracking time so that we
        // don't simulate time passed while the application was paused.
        this.lastFrameTimeMs = timestamp;
        this.lastFpsUpdate = timestamp;
        this.framesSinceLastFpsUpdate = 0;
        // Start the main loop.
        this.rafHandle = requestAnimationFrame(this.animate.bind(this));
    }
    stop() {
        this.running = false;
        this.started = false;
        cancelAnimationFrame(this.rafHandle);
        return this;
    }

    updateClockMultiplier(multiplierMultiplier: number) {
        this.gameClockMultiplier = Math.min(64., Math.max(1., this.gameClockMultiplier * multiplierMultiplier));
    }

    animate(timeStampMsec: number) {
        // request animation next time browser is ready
        this.rafHandle = requestAnimationFrame(this.animate.bind(this));
        // throttle frame rate
        if (timeStampMsec < this.lastFrameTimeMs + this.minFrameDelay) {
            return;
        }
        // simulation time not yet simulated
        this.frameDelta += timeStampMsec - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timeStampMsec;
        // functions that don't depend on time in simulation
        for (const loopStartStep of this.loopStartSteps) {
            loopStartStep.loopStartStep(timeStampMsec, this.frameDelta);
        }
        // this.begin(timestamp, this.frameDelta);
        // update fps estimate
        if (timeStampMsec > this.lastFpsUpdate + this.fpsUpdateInterval) {
            this.fps = this.fpsAlpha * this.framesSinceLastFpsUpdate * 1000 / (timeStampMsec - this.lastFpsUpdate) +
                (1 - this.fpsAlpha) * this.fps;
            // reset fps counters
            this.lastFpsUpdate = timeStampMsec;
            this.framesSinceLastFpsUpdate = 0;
        }
        // count current frame for next fps update
        this.framesSinceLastFpsUpdate++;
        // run simulation update
        this.numUpdateSteps = 0;
        while (this.frameDelta >= this.simulationTimestep) {
            if (!this.simPause) {
                for (const simStep of this.simSteps) {
                    simStep.simStep(this.simulationTimestep*this.gameClockMultiplier);
                }
            }
            this.frameDelta -= this.simulationTimestep;
            if (++this.numUpdateSteps >= 240) {
                this.panic = true;
                break;
            }
        }
        // prepare to draw screen
        for (const module of this.beforeDrawSteps) {
            module.beforeDrawStep(this.frameDelta / this.simulationTimestep);
        }
        // render screen
        for (const module of this.drawSteps) {
            module.drawStep(this.frameDelta / this.simulationTimestep);
        }
        // end of main loop
        for (const loopEndStep of this.loopEndSteps) {
            loopEndStep.loopEndStep(this.fps, this.panic);
        }
        this.panic = false;
    }
}