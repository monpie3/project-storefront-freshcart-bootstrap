import { Pipe, PipeTransform } from "@angular/core";
/*
 The Math.floor() static method always rounds down and returns the largest integer less than or equal to a given number.
*/
@Pipe({ name: "round" })
export class RoundPipe implements PipeTransform {
	transform(value: number): number {
		return Math.floor(value);
	}
}
