import { BaseComponent } from './BaseComponent';
import { Container } from './Container';

const NOOP = function() {};

export interface SimulationModule {

    begin(timestamp: number, frameDelta: number ): void;

    // update simulation (physics and ai)
    update(simulationTimestep: number): void;

    // render visuals
    draw(interpolationPercentage: number): void;

    // end of game loop, called once
    end(fps: number, panic: boolean): void;

}

/**
 * Converted to ts from https://github.com/IceCreamYou/MainLoop.js/blob/gh-pages/src/mainloop.js
 */
export class MainLoop extends BaseComponent {

    // BaseComponent abstract method
    getAdditionalMonitorText(): string {
        return "FPS: "+this.getFPS().toFixed(1);
    }
        
    private simulationTimestep = 1000 / 60; // simulation time size
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
    private simModules: SimulationModule[] = [];

    constructor(container: Container) {
        super(container, MainLoop);
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
    add(simulationModule: SimulationModule) {
        this.simModules.push(simulationModule);
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
        for (const simModule of this.simModules) {
            simModule.draw(1);
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
    isRunning(): boolean {
        return this.running;
    }
    animate(timestamp: number) {
        // request animation next time browser is ready
        this.rafHandle = requestAnimationFrame(this.animate.bind(this));
        // throttle frame rate
        if (timestamp < this.lastFrameTimeMs + this.minFrameDelay) {
            return;
        }
        // simulation time not yet simulated
        this.frameDelta += timestamp - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timestamp;
        // functions that don't depend on time in simulation
        for (const simModule of this.simModules) {
            simModule.begin(timestamp, this.frameDelta);
        }
        // this.begin(timestamp, this.frameDelta);
        // update fps estimate
        if (timestamp > this.lastFpsUpdate + this.fpsUpdateInterval) {
            this.fps = this.fpsAlpha * this.framesSinceLastFpsUpdate * 1000 / (timestamp - this.lastFpsUpdate) +
                (1 - this.fpsAlpha) * this.fps;
            // reset fps counters
            this.lastFpsUpdate = timestamp;
            this.framesSinceLastFpsUpdate = 0;
        }
        // count current frame for next fps update
        this.framesSinceLastFpsUpdate++;
        // run simulation update
        this.numUpdateSteps = 0;
        while (this.frameDelta >= this.simulationTimestep) {
            for (const simModule of this.simModules) {
                simModule.update(this.simulationTimestep);
            }
            this.frameDelta -= this.simulationTimestep;
            if (++this.numUpdateSteps >= 240) {
                this.panic = true;
                break;
            }
        }
        // render screen
        for (const simModule of this.simModules) {
            simModule.draw(this.frameDelta / this.simulationTimestep);
        }
        // end of main loop
        for (const simModule of this.simModules) {
            simModule.end(this.fps, this.panic);
        }
        this.panic = false;
    }
}