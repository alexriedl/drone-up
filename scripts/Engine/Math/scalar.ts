
namespace scalar {
	export function mod(n: number, m: number): number {
		return ((n % m) + m) % m;
	}
}

export default scalar;
