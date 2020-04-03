// let data: string | number;

// data = "hello world";

// console.log('%c%s', 'color: #f2ceb6', data);

export interface ICar {
  color: string,
  model: string,
  topspeed?: number
}

const car1: ICar = {
  color: 'blue',
  model: 'BMW',
  topspeed: 42
}

const car2: ICar = {
  color: 'blue',
  model: 'MERC'
}

// const multiply = (x: number, y: number): number => {
//   return x * y;
// }

const cars: ICar[] = [car1, car2];

export { cars }