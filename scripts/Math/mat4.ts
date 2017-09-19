import vec3 from './vec3';

/**
 * Logic from: https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/mat4.js
 */
// tslint:disable-next-line:class-name
export default class mat4 {
	private elements: number[];

	public get m00(): number { return this.elements[0]; }
	public get m01(): number { return this.elements[1]; }
	public get m02(): number { return this.elements[2]; }
	public get m03(): number { return this.elements[3]; }
	public get m10(): number { return this.elements[4]; }
	public get m11(): number { return this.elements[5]; }
	public get m12(): number { return this.elements[6]; }
	public get m13(): number { return this.elements[7]; }
	public get m20(): number { return this.elements[8]; }
	public get m21(): number { return this.elements[9]; }
	public get m22(): number { return this.elements[10]; }
	public get m23(): number { return this.elements[11]; }
	public get m30(): number { return this.elements[12]; }
	public get m31(): number { return this.elements[13]; }
	public get m32(): number { return this.elements[14]; }
	public get m33(): number { return this.elements[15]; }

	public mul = this.multiply;

	public constructor(elements?: number[]) {
		if (elements) this.elements = [...elements];
		else {
			this.elements = [
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1,
			];
		}
	}

	public copy(): mat4 {
		return new mat4(this.elements);
	}

	public static identity(): mat4 {
		return new mat4();
	}

	public transpose(): mat4 {
		return new mat4([
			this.m00, this.m10, this.m20, this.m30,
			this.m01, this.m11, this.m21, this.m31,
			this.m02, this.m12, this.m22, this.m32,
			this.m03, this.m13, this.m23, this.m33,
		]);
	}

	public translate(v: vec3): mat4 {
		const m30 = this.m00 * v.x + this.m10 * v.y + this.m20 * v.z + this.m30;
		const m31 = this.m01 * v.x + this.m11 * v.y + this.m21 * v.z + this.m31;
		const m32 = this.m02 * v.x + this.m12 * v.y + this.m22 * v.z + this.m32;
		const m33 = this.m03 * v.x + this.m13 * v.y + this.m23 * v.z + this.m33;
		return new mat4([
			this.m00, this.m01, this.m02, this.m03,
			this.m10, this.m11, this.m12, this.m13,
			this.m20, this.m21, this.m22, this.m23,
			m30, m31, m32, m33,
		]);
	}

	public scale(v: vec3): mat4 {
		return new mat4([
			this.m00 * v.x, this.m01 * v.x, this.m02 * v.x, this.m03 * v.x,
			this.m10 * v.y, this.m11 * v.y, this.m12 * v.y, this.m13 * v.y,
			this.m20 * v.z, this.m21 * v.z, this.m22 * v.z, this.m23 * v.z,
			this.m30, this.m31, this.m32, this.m33,
		]);
	}

	public multiply(o: mat4): mat4 {
		const m00 = this.m00 * o.m00 + this.m01 * o.m10 + this.m02 * o.m20 + this.m03 * o.m30;
		const m01 = this.m00 * o.m01 + this.m01 * o.m11 + this.m02 * o.m21 + this.m03 * o.m31;
		const m02 = this.m00 * o.m02 + this.m01 * o.m12 + this.m02 * o.m22 + this.m03 * o.m32;
		const m03 = this.m00 * o.m03 + this.m01 * o.m13 + this.m02 * o.m23 + this.m03 * o.m33;

		const m10 = this.m10 * o.m00 + this.m11 * o.m10 + this.m12 * o.m20 + this.m13 * o.m30;
		const m11 = this.m10 * o.m01 + this.m11 * o.m11 + this.m12 * o.m21 + this.m13 * o.m31;
		const m12 = this.m10 * o.m02 + this.m11 * o.m12 + this.m12 * o.m22 + this.m13 * o.m32;
		const m13 = this.m10 * o.m03 + this.m11 * o.m13 + this.m12 * o.m23 + this.m13 * o.m33;

		const m20 = this.m20 * o.m00 + this.m21 * o.m10 + this.m22 * o.m20 + this.m23 * o.m30;
		const m21 = this.m20 * o.m01 + this.m21 * o.m11 + this.m22 * o.m21 + this.m23 * o.m31;
		const m22 = this.m20 * o.m02 + this.m21 * o.m12 + this.m22 * o.m22 + this.m23 * o.m32;
		const m23 = this.m20 * o.m03 + this.m21 * o.m13 + this.m22 * o.m23 + this.m23 * o.m33;

		const m30 = this.m30 * o.m00 + this.m31 * o.m10 + this.m32 * o.m20 + this.m33 * o.m30;
		const m31 = this.m30 * o.m01 + this.m31 * o.m11 + this.m32 * o.m21 + this.m33 * o.m31;
		const m32 = this.m30 * o.m02 + this.m31 * o.m12 + this.m32 * o.m22 + this.m33 * o.m32;
		const m33 = this.m30 * o.m03 + this.m31 * o.m13 + this.m32 * o.m23 + this.m33 * o.m33;

		return new mat4([
			m00, m01, m02, m03,
			m10, m11, m12, m13,
			m20, m21, m22, m23,
			m30, m31, m32, m33,
		]);
	}

	public getTranslation(): vec3 {
		return new vec3(this.m30, this.m31, this.m32);
	}

	public str(): string {
		return `(${this.m00}, ${this.m01}, ${this.m02}, ${this.m03})
(${this.m10}, ${this.m11}, ${this.m12}, ${this.m13})
(${this.m20}, ${this.m21}, ${this.m22}, ${this.m23})
(${this.m30}, ${this.m31}, ${this.m32}, ${this.m33})`;
	}

	public toFloat32Array(): Float32Array {
		return new Float32Array(this.elements);
	}

	public toFloat64Array(): Float64Array {
		return new Float64Array(this.elements);
	}

	/**
	 * Creates a matrix from a vector translation.
	 * This is equivalent to (but much faster than):
	 *
	 *    const m = mat4.identity();
	 *    m.translate(vec);
	 */
	public static fromTranslation(v: vec3) {
		return new mat4([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			v.x, v.y, v.z, 1,
		]);
	}

	/**
	 * Creates a matrix from a vector scale.
	 * This is equivalent to (but much faster than):
	 *
	 *    const m = mat4.identity();
	 *    m.scale(vec);
	 */
	public static fromScale(v: vec3) {
		return new mat4([
			v.x, 0, 0, 0,
			0, v.y, 0, 0,
			0, 0, v.z, 0,
			0, 0, 0, 1,
		]);
	}

	/**
	 * Generates a frustum matrix with the given bounds
	 */
	public static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): mat4 {
		const rl = 1 / (right - left);
		const tb = 1 / (top - bottom);
		const nf = 1 / (near - far);
		return new mat4([
			(near * 2) * rl, 0, 0, 0,
			0, (near * 2) * tb, 0, 0,
			(right + left) * rl, (top + bottom) * tb, (far + near) * nf, -1,
			0, 0, (far * near * 2) * nf, 0,
		]);
	}

	/**
	 * Generates a perspective projection matrix with the given bounds
	 */
	public static perspective(fovy, aspect, near, far) {
		const f = 1.0 / Math.tan(fovy / 2);
		const nf = 1 / (near - far);

		return new mat4([
			f / aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (far + near) * nf, -1,
			0, 0, (2 * far * near) * nf, 0,
		]);
	}

	/**
	 * Generates an orthogonal projection matrix with the given bounds
	 */
	public static ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): mat4 {
		const lr = 1 / (left - right);
		const bt = 1 / (bottom - top);
		const nf = 1 / (near - far);
		return new mat4([
			-2 * lr, 0, 0, 0,
			0, -2 * bt, 0, 0,
			0, 0, 2 * nf, 0,
			(left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1,
		]);
	}
}
