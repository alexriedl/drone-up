// tslint:disable-next-line:class-name
export default class vec4 {
	public readonly x: number;
	public readonly y: number;
	public readonly z: number;
	public readonly w: number;

	public get xy(): number[] { return [this.x, this.y]; }
	public get yz(): number[] { return [this.y, this.z]; }
	public get xyz(): number[] { return [this.x, this.y, this.z]; }
	public get xyzw(): number[] { return [this.x, this.y, this.z, this.w]; }
	public get r(): number { return this.x; }
	public get g(): number { return this.y; }
	public get b(): number { return this.z; }
	public get a(): number { return this.w; }
	public get rgb(): number[] { return [this.r, this.g, this.b]; }
	public get rgba(): number[] { return [this.r, this.g, this.b, this.a]; }

	public len = this.length;
	public sub = this.subtract;
	public mul = this.multiply;
	public div = this.divide;
	public dist = this.distance;
	public sqrDist = this.squaredDistance;
	public sqrLen = this.squaredLength;

	public constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	/**
	 * Create a new vector with the same values as this vector
	 */
	public clone(): vec4 {
		return new vec4(this.x, this.y, this.z, this.w);
	}

	/**
	 * Add another vector to this vector, and return a new vector with the result
	 */
	public add(other: vec4): vec4 {
		return new vec4(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
	}

	/**
	 * Subtract another vector from this vector, and return a new vector with the result
	 */
	public subtract(other: vec4): vec4 {
		return new vec4(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);
	}

	/**
	 * Multiply another vector to this vector, and return a new vector with the result
	 */
	public multiply(other: vec4): vec4 {
		return new vec4(this.x * other.x, this.y * other.y, this.z * other.z, this.w * other.w);
	}

	/**
	 * Divide another vector from this vector, and return a new vector with the result
	 */
	public divide(other: vec4): vec4 {
		return new vec4(this.x / other.x, this.y / other.y, this.z / other.z, this.w / other.w);
	}

	/**
	 * Math.ceil the components of this vector, and return a new vector with the result
	 */
	public ceil(): vec4 {
		return new vec4(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z), Math.ceil(this.w));
	}

	/**
	 * Math.floor the components of this vector, and return a new vector with the result
	 */
	public floor(): vec4 {
		return new vec4(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z), Math.floor(this.w));
	}

	/**
	 * Math.min the components of this vector, and return a new vector with the result
	 */
	public min(): vec4 {
		return new vec4(Math.min(this.x), Math.min(this.y), Math.min(this.z), Math.min(this.w));
	}

	/**
	 * Math.max the components of this vector, and return a new vector with the result
	 */
	public max(): vec4 {
		return new vec4(Math.max(this.x), Math.max(this.y), Math.max(this.z), Math.max(this.w));
	}

	/**
	 * Math.round the components of this vector, and return a new vector with the result
	 */
	public round(): vec4 {
		return new vec4(Math.round(this.x), Math.round(this.y), Math.round(this.z), Math.round(this.w));
	}

	/**
	 * Multiply each component of this vector by the scale value, and return
	 * a new vector with the result
	 */
	public scale(scale: number): vec4 {
		return new vec4(this.x * scale, this.y * scale, this.z * scale, this.w * scale);
	}

	/**
	 * Calculates the euclidian distance between this vector and another vector
	 */
	public distance(other: vec4): number {
		const x = other.x - this.x;
		const y = other.y - this.y;
		const z = other.z - this.z;
		const w = other.w - this.w;
		return Math.sqrt(x * x + y * y + z * z + w * w);
	}

	/**
	 * Calculates the squared euclidian distance between this vector and another vector
	 */
	public squaredDistance(other: vec4): number {
		const x = other.x - this.x;
		const y = other.y - this.y;
		const z = other.z - this.z;
		const w = other.w - this.w;
		return x * x + y * y + z * z + w * w;
	}

	/**
	 * Calculates the length of this vector
	 */
	public length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}

	/**
	 * Calculates the length of this vector
	 */
	public squaredLength(): number {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}

	/**
	 * Negates the components of this vector, and returns a new vector with the result
	 */
	public negate(): vec4 {
		return new vec4(-this.x, -this.y, -this.z, -this.w);
	}

	/**
	 * Returns the inverse of this vector
	 */
	public inverse(): vec4 {
		return new vec4(1.0 / this.x, 1.0 / this.y, 1.0 / this.z, 1.0 / this.w);
	}

	/**
	 * Normalizes this vector, and returns a new vector with the result
	 */
	public normalize() {
		const sqLen = this.squaredLength();
		if (sqLen <= 0) return this;
		const len = 1 / Math.sqrt(sqLen);
		return new vec4(this.x * len, this.y * len, this.z * len, this.w * len);
	}

	/**
	 * Calculates the dot product of two vectors
	 */
	public dot(other: vec4): number {
		return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
	}

	/**
	 * Performs a linear interpolation between this vector and another vector
	 */
	public lerp(other: vec4, t: number): vec4 {
		const x = this.x + t * (other.x - this.x);
		const y = this.y + t * (other.y - this.y);
		const z = this.z + t * (other.z - this.z);
		const w = this.w + t * (other.w - this.w);
		return new vec4(x, y, z, w);
	}

	/**
	 * Returns a string representation of this vector
	 */
	public str(): string {
		return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
	}

	/**
	 * Returns whether or not this vector's components exactly matches another vector's. (Compared
	 * with ===)
	 */
	public exactEquals(other: vec4): boolean {
		return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
	}

	/**
	 * Returns a Float32Array with the components from this vector
	 */
	public toFloat32Array(): Float32Array {
		return new Float32Array([this.x, this.y, this.z, this.w]);
	}

	/**
	 * Returns a Float64Array with the components from this vector
	 */
	public toFloat64Array(): Float64Array {
		return new Float64Array([this.x, this.y, this.z, this.w]);
	}
}
