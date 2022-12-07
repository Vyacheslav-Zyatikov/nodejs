'use strict';
import colors from 'colors'

let [arg1, arg2] = process.argv.slice(2);
arg1 = +arg1;
arg2 = +arg2;
let currentIndex = 0;
let countSimpleNumbers = 0;

function simpleNumbers(arg1, arg2) {
    if (checkErrors()) return false;
    createSimpleNumbers(arg1, arg2);
}

function createSimpleNumbers(start, arg2) {
    let startPoint;
    if (arg1 <= 1) startPoint = 2
    else startPoint = arg1;
    Loop:
        for (let i = startPoint; i <= arg2; i++) {
            for (let j = 2; j < i; j++) {
                if (i % j === 0) {
                    continue Loop;
                }
            }
            output(i);
        }
        if(countSimpleNumbers === 0){
            console.error(colors.red(`В диапозоне чисел от ${arg1} до ${arg2} простых чисел нет`));
        }
}

function output(number) {
    countSimpleNumbers++;
    makeOutput(number, currentIndex);
    if (currentIndex !== 2) currentIndex++
    else currentIndex = 0;
}

function makeOutput(number, index) {
    switch (index) {
        case 1:
            console.log(colors.yellow(number));
            break;
        case 2:
            console.log(colors.red(number));
            break;
        default:
            console.log(colors.green(number));
    }

}

function checkErrors() {
    if (!arg1 || !arg2) {
        console.log(colors.red('Нет входных данных, укажите 2 входных параметра (целые числа) через пробел при запуске программы, пример: npm run hw1 1 100'));
        return true;
    }
    if (isNaN(arg1)) {
        console.log(colors.red('Первый параметр не является числом'));
        return true;
    }
    if (isNaN(arg2)) {
        console.log(colors.red('Второй параметр не является числом'));
        return true;
    }
    if (arg2 < arg1) {
        console.log(colors.red('Конец диапазона не может быть меньше начала'));
        return true;
    }
    return false;
}

simpleNumbers(arg1, arg2);