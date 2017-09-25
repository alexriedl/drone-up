// tslint:disable-next-line:class-name
export default class vec3 {
	public readonly x: number;
	public readonly y: number;
	public readonly z: number;

	public get xy(): number[] { return [this.x, this.y]; }
	public get yz(): number[] { return [this.y, this.z]; }
	public get xyz(): number[] { return [this.x, this.y, this.z]; }
	public get r(): number { return this.x; }
	public get g(): number { return this.y; }
	public get b(): number { return this.z; }
	public get rgb(): number[] { return [this.r, this.g, this.b]; }

	public len = this.length;
	public sub = this.subtract;
	public mul = this.multiply;
	public div = this.divide;
	public dist = this.distance;
	public sqrDist = this.squaredDistance;
	public sqrLen = this.squaredLength;

	public constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * Create a new vector with the same values as this vector
	 */
	public clone(): vec3 {
		return new vec3(this.x, this.y, this.z);
	}

	/**
	 * Add another vector to this vector, and return a new vector with the result
	 */
	public add(other: vec3): vec3 {
		return new vec3(this.x + other.x, this.y + other.y, this.z + other.z);
	}

	/**
	 * Add values to this vector, and return a new vector with the result
	 */
	public addValues(x: number, y: number, z: number): vec3 {
		return new vec3(this.x + x, this.y + y, this.z + z);
	}

	/**
	 * Subtract another vector from this vector, and return a new vector with the result
	 */
	public subtract(other: vec3): vec3 {
		return new vec3(this.x - other.x, this.y - other.y, this.z - other.z);
	}

	/**
	 * Multiply another vector to this vector, and return a new vector with the result
	 */
	public multiply(other: vec3): vec3 {
		return new vec3(this.x * other.x, this.y * other.y, this.z * other.z);
	}

	/**
	 * Divide another vector from this vector, and return a new vector with the result
	 */
	public divide(other: vec3): vec3 {
		return new vec3(this.x / other.x, this.y / other.y, this.z / other.z);
	}

	/**
	 * Mod divide each componenet by a value
	 */
	public mod(value: number): vec3 {
		return new vec3(this.x % value, this.y % value, this.z % value);
	}

	/**
	 * Math.ceil the components of this vector, and return a new vector with the result
	 */
	public ceil(): vec3 {
		return new vec3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
	}

	/**
	 * Math.floor the components of this vector, and return a new vector with the result
	 */
	public floor(): vec3 {
		return new vec3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
	}

	/**
	 * Math.min the components of this vector, and return a new vector with the result
	 */
	public min(): vec3 {
		const o = Math.min(this.x, this.y, this.z);
		return new vec3(o, o, o);
	}

	/**
	 * Math.max the components of this vector, and return a new vector with the result
	 */
	public max(): vec3 {
		const o = Math.max(this.x, this.y, this.z);
		return new vec3(o, o, o);
	}

	/**
	 * Math.round the components of this vector, and return a new vector with the result
	 */
	public round(): vec3 {
		return new vec3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
	}

	/**
	 * Multiply each component of this vector by the scale value, and return
	 * a new vector with the result
	 */
	public scale(scale: number): vec3 {
		return new vec3(this.x * scale, this.y * scale, this.z * scale);
	}

	/**
	 * Calculates the euclidian distance between this vector and another vector
	 */
	public distance(other: vec3): number {
		const x = other.x - this.x;
		const y = other.y - this.y;
		const z = other.z - this.z;
		return Math.sqrt(x * x + y * y + z * z);
	}

	/**
	 * Calculates the squared euclidian distance between this vector and another vector
	 */
	public squaredDistance(other: vec3): number {
		const x = other.x - this.x;
		const y = other.y - this.y;
		const z = other.z - this.z;
		return x * x + y * y + z * z;
	}

	/**
	 * Calculates the length of this vector
	 */
	public length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	/**
	 * Calculates the length of this vector
	 */
	public squaredLength(): number {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	/**
	 * Negates the components of this vector, and returns a new vector with the result
	 */
	public negate(): vec3 {
		return new vec3(-this.x, -this.y, -this.z);
	}

	/**
	 * Returns the inverse of this vector
	 */
	public inverse(): vec3 {
		return new vec3(1.0 / this.x, 1.0 / this.y, 1.0 / this.z);
	}

	/**
	 * Normalizes this vector, and returns a new vector with the result
	 */
	public normalize() {
		const sqLen = this.squaredLength();
		if (sqLen <= 0) return this;
		const len = 1 / Math.sqrt(sqLen);
		return new vec3(this.x * len, this.y * len, this.z * len);
	}

	/**
	 * Calculates the dot product of two vectors
	 */
	public dot(other: vec3): number {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	/**
	 * Calculates the cross product of two vectors
	 */
	public cross(other: vec3): vec3 {
		const x = this.y * other.z - this.z * other.y;
		const y = this.z * other.x - this.x * other.z;
		const z = this.x * other.y - this.y * other.x;
		return new vec3(x, y, z);
	}

	/**
	 * Performs a linear interpolation between this vector and another vector
	 */
	public lerp(other: vec3, t: number): vec3 {
		const x = this.x + t * (other.x - this.x);
		const y = this.y + t * (other.y - this.y);
		const z = this.z + t * (other.z - this.z);
		return new vec3(x, y, z);
	}

	/**
	 * Returns a string representation of this vector
	 */
	public str(): string {
		return `(${this.x}, ${this.y}, ${this.z})`;
	}

	/**
	 * Returns whether or not this vector's components exactly matches another vector's. (Compared
	 * with ===)
	 */
	public exactEquals(other: vec3): boolean {
		return this.x === other.x && this.y === other.y && this.z === other.z;
	}

	/**
	 * Returns a Float32Array with the components from this vector
	 */
	public toFloat32Array(): Float32Array {
		return new Float32Array([this.x, this.y, this.z]);
	}

	/**
	 * Returns a Float64Array with the components from this vector
	 */
	public toFloat64Array(): Float64Array {
		return new Float64Array([this.x, this.y, this.z]);
	}

	/**
	 * Returns a new vec3 from the values of an array
	 */
	public static fromArray(values: number[]): vec3 {
		return new vec3(values[0], values[1], values[2]);
	}
}
