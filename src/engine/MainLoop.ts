import { ComponentOptions } from "../container/Component";
import { Monitor } from "../observability/Monitor";
import { HtmlElements } from "./HtmlElements";
import { AbstractComponent } from "../container/AbstractComponent";
import { InputProcessor } from "../input/InputProcessor";
import { SimulationProcessor } from "../simulation/SimulationProcessor";
import { GraphicRenderer } from "../rendering/GraphicRenderer";


/**
 * Converted to ts from https://github.com/IceCreamYou/MainLoop.js/blob/gh-pages/src/mainloop.js
 */
export class MainLoop extends AbstractComponent  {

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
    private simPause: boolean = false;

    constructor(options: ComponentOptions) {
        super({...options, key: MainLoop});
    }
    
    init(): void {
        super.init();
        this.resolve(Monitor).addEntry({ observable: this , additionalText: () => this.monitorText() });
    }

    togglePauseSimulation(): void {
        this.simPause = !this.simPause;
        this.resolve(HtmlElements).showExecutionModeText(this.simPause ? "PAUSED" : undefined);
    }

    monitorText(): string {
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
    setMaxAllowedFPS(fps?: number) {
        if (fps === undefined) {
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
    start() {
        if (!this.started) {
            this.started = true;
            this.rafHandle = requestAnimationFrame(this.startCallback.bind(this));
        }
        return this;
    }
    startCallback(timestamp: number) {
        // Render the initial state before any updates occur.
        this.resolve(GraphicRenderer).doRender(1);
        // Reset variables that are used for tracking time so that we
        // don't simulate time passed while the application was paused.
        this.lastFrameTimeMs = timestamp;
        this.lastFpsUpdate = timestamp;
        this.framesSinceLastFpsUpdate = 0;
        // Start the main loop.
        this.rafHandle = requestAnimationFrame(this.animate.bind(this));
    }
    stop() {
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
        // process input
        this.resolve(InputProcessor).processInput(timeStampMsec, this.frameDelta);
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
                this.resolve(SimulationProcessor).processSimulationStep(this.simulationTimestep*this.gameClockMultiplier);
            }
            this.frameDelta -= this.simulationTimestep;
            if (++this.numUpdateSteps >= 240) {
                this.panic = true;
                break;
            }
        }
        // render screen
        this.resolve(GraphicRenderer).doRender(this.frameDelta / this.simulationTimestep);
        // end of main loop
        this.resolve(Monitor).updateMonitor(this.fps, this.panic);
        this.panic = false;
    }
}