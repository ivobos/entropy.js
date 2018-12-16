import * as time from './time';

export class Fps {

    private MEASUREMENT_PERIOD_SEC = 1;
    private startMeasurementTimeMsec: number = 0;
    private framesRendered: number = 0;
    private fps: string = "";
    
    startMeasurement(currentTimeMsec: number) {
        this.startMeasurementTimeMsec = currentTimeMsec;
        this.framesRendered = 0;
    }
    
    frameRendered() {
        const currentTimeMsec = time.getMsecTimestamp();
        if (this.startMeasurementTimeMsec === 0) {
            this.startMeasurement(currentTimeMsec);
            return;
        }
        this.framesRendered++;
        if (this.startMeasurementTimeMsec + this.MEASUREMENT_PERIOD_SEC * time.MSEC_PER_SEC >= currentTimeMsec ) return;
        const measurementTimeSec = (currentTimeMsec - this.startMeasurementTimeMsec) / time.MSEC_PER_SEC;
        this.fps = (this.framesRendered / measurementTimeSec).toFixed(1);
        this.startMeasurement(currentTimeMsec);
    }

    getFps(): string {
        return this.fps;
    }    

}