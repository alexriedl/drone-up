import vec3 from './vec3';

function mod(n: number, m: number): number {
	return ((n % m) + m) % m;
}

// tslint:disable-next-line:class-name
export default class vec2 {
	public readonly x: number;
	public readonly y: number;

	public get xy(): number[] { return [this.x, this.y]; }

	public len = this.length;
	public sub = this.subtract;
	public mul = this.multiply;
	public div = this.divide;
	public dist = this.distance;
	public sqrDist = this.squaredDistance;
	public sqrLen = this.squaredLength;

	public constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	public toVec3(z: number = 0) {
		return new vec3(this.x, this.y, z);
	}

	/**
	 * Create a new vector with the same values as this vector
	 */
	public clone(): vec2 {
		return new vec2(this.x, this.y);
	}

	/**
	 * Add another vector to this vector, and return a new vector with the result
	 */
	public add(other: vec2): vec2 {
		return new vec2(this.x + other.x, this.y + other.y);
	}

	/**
	 * Add values to this vector, and return a new vector with the result
	 */
	public addValues(x: number, y: number): vec2 {
		return new vec2(this.x + x, this.y + y);
	}

	/**
	 * Subtract another vector from this vector, and return a new vector with the result
	 */
	public subtract(other: vec2): vec2 {
		return new vec2(this.x - other.x, this.y - other.y);
	}

	/**
	 * Multiply another vector to this vector, and return a new vector with the result
	 */
	public multiply(other: vec2): vec2 {
		return new vec2(this.x * other.x, this.y * other.y);
	}

	/**
	 * Divide another vector from this vector, and return a new vector with the result
	 */
	public divide(other: vec2): vec2 {
		return new vec2(this.x / other.x, this.y / other.y);
	}

	/**
	 * Mod divide each componenet by a value
	 */
	public mod(value: number): vec2 {
		return new vec2(this.x % value, this.y % value);
	}

	/**
	 * Mod divide each componenet by a value using a better than default mod function
	 */
	public cmod(value: number): vec2 {
		return new vec2(mod(this.x, value), mod(this.y, value));
	}

	/**
	 * Math.ceil the components of this vector, and return a new vector with the result
	 */
	public ceil(): vec2 {
		return new vec2(Math.ceil(this.x), Math.ceil(this.y));
	}

	/**
	 * Math.floor the components of this vector, and return a new vector with the result
	 */
	public floor(): vec2 {
		return new vec2(Math.floor(this.x), Math.floor(this.y));
	}

	/**
	 * Math.min the components of this vector, and return a new vector with the result
	 */
	public min(): vec2 {
		const o = Math.min(this.x, this.y);
		return new vec2(o, o);
	}

	/**
	 * Math.max the components of this vector, and return a new vector with the result
	 */
	public max(): vec2 {
		const o = Math.max(this.x, this.y);
		return new vec2(o, o);
	}

	/**
	 * Math.round the components of this vector, and return a new vector with the result
	 */
	public round(): vec2 {
		return new vec2(Math.round(this.x), Math.round(this.y));
	}

	/**
	 * Multiply each component of this vector by the scale value, and return
	 * a new vector with the result
	 */
	public scale(scale: number): vec2 {
		return new vec2(this.x * scale, this.y * scale);
	}

	/**
	 * Calculates the euclidian distance between this vector and another vector
	 */
	public distance(other: vec2): number {
		const x = other.x - this.x;
		const y = other.y - this.y;
		return Math.sqrt(x * x + y * y);
	}

	/**
	 * Calculates the squared euclidian distance between this vector and another vector
	 */
	public squaredDistance(other: vec2): number {
		const x = other.x - this.x;
		const y = other.y - this.y;
		return x * x + y * y;
	}

	/**
	 * Calculates the length of this vector
	 */
	public length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	/**
	 * Calculates the length of this vector
	 */
	public squaredLength(): number {
		return this.x * this.x + this.y * this.y;
	}

	/**
	 * Negates the components of this vector, and returns a new vector with the result
	 */
	public negate(): vec2 {
		return new vec2(-this.x, -this.y);
	}

	/**
	 * Returns the inverse of this vector
	 */
	public inverse(): vec2 {
		return new vec2(1.0 / this.x, 1.0 / this.y);
	}

	/**
	 * Normalizes this vector, and returns a new vector with the result
	 */
	public normalize(): vec2 {
		const sqLen = this.squaredLength();
		if (sqLen <= 0) return this;
		const len = 1 / Math.sqrt(sqLen);
		return new vec2(this.x * len, this.y * len);
	}

	/**
	 * Calculates the dot product of two vectors
	 */
	public dot(other: vec2): number {
		return this.x * other.x + this.y * other.y;
	}

	/**
	 * Calculates the cross product of two vectors
	 */
	public cross(other: vec2): vec3 {
		const z = this.x * other.y - this.y * other.x;
		return new vec3(0, 0, z);
	}

	/**
	 * Performs a linear interpolation between this vector and another vector
	 */
	public lerp(other: vec2, t: number): vec2 {
		const x = this.x + t * (other.x - this.x);
		const y = this.y + t * (other.y - this.y);
		return new vec2(x, y);
	}

	/**
	 * Returns a string representation of this vector
	 */
	public str(): string {
		return `(${this.x}, ${this.y})`;
	}

	/**
	 * Returns whether or not this vector's components exactly matches another vector's. (Compared
	 * with ===)
	 */
	public exactEquals(other: vec2): boolean {
		return this.x === other.x && this.y === other.y;
	}

	/**
	 * Returns a Float32Array with the components from this vector
	 */
	public toFloat32Array(): Float32Array {
		return new Float32Array([this.x, this.y]);
	}

	/**
	 * Returns a Float64Array with the components from this vector
	 */
	public toFloat64Array(): Float64Array {
		return new Float64Array([this.x, this.y]);
	}

	/**
	 * Returns a new vec2 from the values of an array
	 */
	public static fromArray(values: number[]): vec2 {
		return new vec2(values[0], values[1]);
	}
}
