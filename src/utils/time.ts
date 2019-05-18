
// time constants
const TICKS_PER_SEC = 60;
export const MSEC_PER_SEC = 1000;

export function ticksToMsec(ticks: number) {
    return ticks *  MSEC_PER_SEC / TICKS_PER_SEC;
}

// how long does a tick take, in seconds
export function tickPeriodSecs() {
    return 1 / TICKS_PER_SEC;
}

// this is a function that returns current millisecond timestamp
let _getMsecTimestamp: Function; 
let _currentTick: number;

// for use in tests only
export function setGetMsecTimestampFunction(newGetMsecTimestamp: Function) {
    _getMsecTimestamp = newGetMsecTimestamp;
}

export function getMsecTimestamp(): number {
    return _getMsecTimestamp();
}

export function time_init() {
    if (_getMsecTimestamp) {
        // this is the path used when mocha tests stub the _getMsecTimestamp for testing
        // test will use the setGetMsecTimestampFunction to set _getMsecTimestamp
    } else if (typeof(window) !== 'undefined' && window.performance && window.performance.now) {
        _getMsecTimestamp = function () {
            return window.performance.now();
        };
    } else {
        _getMsecTimestamp = function () {
            return Date.now();
        };
    }
}

export function getLastTickDivisibleBy(divider: number) {
    const ts = _getMsecTimestamp();
    const tick = Math.floor(ts * TICKS_PER_SEC / MSEC_PER_SEC / divider) * divider;
    return tick;
}

export function getCurrentTick(): number {
    return _currentTick;
}

// this function only works if the divider you pass in is always the same
// on first call it returns a 0
export function getTicksElapsedDivisibleBy(divider: number): number {
    if (!_currentTick) {
        _currentTick = getLastTickDivisibleBy(divider);
        return 0; // called the first time
    } else {
        const newTick = getLastTickDivisibleBy(divider);
        const ticksElapsed = newTick - _currentTick;
        _currentTick = newTick;
        return ticksElapsed;
    }
}

export function msecToNextTickChangeDivisibleBy(divider: number): number {
    const ts = _getMsecTimestamp();
    const tick = Math.floor(ts * TICKS_PER_SEC / MSEC_PER_SEC / divider) * divider;
    const nextTick = tick + divider;
    const nextMsec = nextTick * MSEC_PER_SEC / TICKS_PER_SEC;
    return nextMsec - ts;
}


export function secToMsec(sec: number): number {
    return sec * 1000;
}

// converted to ts from : https://stackoverflow.com/questions/8211744/convert-time-interval-given-in-seconds-into-more-human-readable-form
export function msecDurationToStr(milliseconds: number): string {
    function numberEnding (n: number) {
        return (n > 1) ? 's' : '';
    }

    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    //TODO: Months! Maybe weeks? 
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' min' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' sec' + numberEnding(seconds);
    }
    return 'now'; //'just now' //or other string you like;
}
