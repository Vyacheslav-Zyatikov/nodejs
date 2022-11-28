'use strict';
import EventEmitter from "events";

// склонение числительных
function declensionNum(num, words) {
    return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
}

class Handler {
    static #timers = [];
    static interval = null;
    static seconds;
    static minutes;
    static hours;
    static days;

    static setTimer(timer) {
        this.#timers.push(timer);
    }

    static #leftTimeToString(time) {
        const timer = {
            seconds: Math.floor((time / 1000) % 60),
            minutes: Math.floor((time / 1000 / 60) % 60),
            hours: Math.floor((time / (1000 * 60 * 60)) % 24),
            days: Math.floor(time / (1000 * 60 * 60 * 24)),
        }
        const title = [this.seconds, this.minutes, this.hours, this.days ];

        timer.days = timer.days < 10 ? '0' + timer.days : timer.days;
        timer.hours = timer.hours < 10 ? '0' + timer.hours : timer.hours;
        timer.minutes = timer.minutes < 10 ? '0' + timer.minutes : timer.minutes;
        timer.seconds = timer.seconds < 10 ? '0' + timer.seconds : timer.seconds;
        title.days = declensionNum(timer.days, ['день', 'дня', 'дней']);
        title.hours = declensionNum(timer.hours, ['час', 'часа', 'часов']);
        title.minutes = declensionNum(timer.minutes, ['минута', 'минуты', 'минут']);
        title.seconds = declensionNum(timer.seconds, ['секунда', 'секунды', 'секунд']);

        return `осталось ${timer.days} ${title.days} ${timer.hours} ${title.hours} ${timer.minutes} ${title.minutes} ${timer.seconds} ${title.seconds}`;
    }

    static handler() {
        const now = Date.now();
        if (!this.#timers.length) {
            console.log("Нет ни одного таймера!");
            clearInterval(this.interval);
        } else {
            this.#timers.forEach(target => {
                const diffTime = target.timeToSeconds() - now;
                if (diffTime > 0) {
                    console.clear()
                    console.log(target.time, Handler.#leftTimeToString(diffTime));
                } else {
                    console.log(target.time,  "закончил отсчет");
                    this.#timers = this.#timers.filter(item => item !== target);
                }
            })
        }
    }
}

class Time {
    constructor(timeString) {
        this.time = timeString;
    }

    timeToSeconds() {
        let [hour, day, month, year] = this.time.split('-');

        if (year.toString().length === 2) {
            year = Number(`20${year}`);
        }

        const date = new Date(year, month - 1, day, hour);
        return date.getTime();
    }
}

const lesson2 = () => {
    class TimeEmitter extends EventEmitter {}
    const emitter = new TimeEmitter();

    emitter.on('getTimers', Handler.handler.bind(Handler));

    Handler.interval = setInterval(() => emitter.emit('getTimers'), 1000);

    const args = process.argv.slice(2);

    args.forEach(item => {
        Handler.setTimer(new Time(item));
    })
}

lesson2();