enum MapTile {
	DNW, // Double North West
	DNE, // Double North East
	DSW, // Double South West
	DSE, // Double South East

	DN_, // Double North
	DS_, // Double Sorth
	DE_, // Double East
	DW_, // Double West

	SN_, // Single North
	SS_, // Single North
	SE_, // Single North
	SW_, // Single North

	SNW, // Single North West
	SNE, // Single North East
	SSW, // Single South West
	SSE, // Single South East

	PEE, // Pen End East
	PEW, // Pen End West
	GGG, // Pen Gate
	GP_, // Inside the Ghost Pen

	PNW, // Pen North West
	PNE, // Pen North East
	PSW, // Pen South West
	PSE, // Pen South East

	INW, // Inner North West
	INE, // Inner North East
	ISW, // Inner South West
	ISE, // Inner South East

	NNW, // North (barrior) North West
	NNE, // North (barrior) North East

	ENE, // East (barrior) North East
	ESE, // East (barrior) South East

	WNW, // West (barrior) North West
	WSW, // West (barrior) South West

	// Starting Points
	_PS, // Pacman Start
	_FS, // Fruit Start
	GSB, // Ghost Start Blinky
	GSP, // Ghost Start Pinky
	GSI, // Ghost Start Inky
	GSC, // Ghost Start Clyde

	// Pellets
	_p_, // Pellet
	_E_, // Energizer

	// Special
	_s_, // Slow (Empty)
	RU_, // Restrict Up
	RUp, // Restrict Up (with a Pellet)
	GTB, // Ghost Target Blinky
	GTP, // Ghost Target Pinky
	GTI, // Ghost Target Inky
	GTC, // Ghost Target Clyde

	// Extra
	FFF, // Full
	___, // Empty
}

namespace MapTile {
	export const PIXELS_PER_TILE = 8;

	export enum BasicMapTile {
		BLOCK = 'BLOCK',
		OPEN = 'OPEN',
		SLOW = 'SLOW',
		RESTRICTED_UP = 'RESTRICTED_UP',
		GHOST_PEN = 'GHOST_PEN',
	}

	export function toBasicMapTile(tile: MapTile): BasicMapTile {
		switch (tile) {
			case MapTile._PS:
			case MapTile._FS:
			case MapTile.GSB:
			case MapTile._p_:
			case MapTile._E_:
			case MapTile.___: return BasicMapTile.OPEN;

			case MapTile._s_: return BasicMapTile.SLOW;

			case MapTile.RUp:
			case MapTile.RU_: return BasicMapTile.RESTRICTED_UP;

			case MapTile.GSP:
			case MapTile.GSI:
			case MapTile.GSC:
			case MapTile.GGG: case MapTile.GP_: return BasicMapTile.GHOST_PEN;

			default: return BasicMapTile.BLOCK;
		}
	}

	/**
	 * For a given tile, generate an array to indicate which pixels are lit up.
	 *
	 * Returns an array of ints. Each element in the array is a row of pixels in the
	 * tile. Each bit in each element indicates which pixels are lit. Bit 0, is x
	 * 0.
	 */
	export function getPixelInfo(tile: MapTile): number[] {
		switch (tile) {
			case MapTile.DNW: return [0x07, 0x18, 0x20, 0x47, 0x48, 0x90, 0x90, 0x90];
			case MapTile.DNE: return [0xE0, 0x18, 0x04, 0xE2, 0x12, 0x09, 0x09, 0x09];
			case MapTile.DSW: return [0x90, 0x90, 0x90, 0x48, 0x47, 0x20, 0x18, 0x07];
			case MapTile.DSE: return [0x09, 0x09, 0x09, 0x12, 0xE2, 0x04, 0x18, 0xE0];

			case MapTile.DN_: return [0xFF, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00];
			case MapTile.DS_: return [0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0xFF];
			case MapTile.DE_: return [0x09, 0x09, 0x09, 0x09, 0x09, 0x09, 0x09, 0x09];
			case MapTile.DW_: return [0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90, 0x90];

			case MapTile.SN_: return [0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00];
			case MapTile.SS_: return [0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00];
			case MapTile.SE_: return [0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08];
			case MapTile.SW_: return [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10];

			case MapTile.SNW: return [0x10, 0x10, 0x20, 0xC0, 0x00, 0x00, 0x00, 0x00];
			case MapTile.SNE: return [0x08, 0x08, 0x04, 0x03, 0x00, 0x00, 0x00, 0x00];
			case MapTile.SSW: return [0x00, 0x00, 0x00, 0x00, 0xC0, 0x20, 0x10, 0x10];
			case MapTile.SSE: return [0x00, 0x00, 0x00, 0x00, 0x03, 0x04, 0x08, 0x08];

			case MapTile.PEE: return [0x00, 0x00, 0x00, 0x00, 0xFF, 0x80, 0x80, 0xFF];
			case MapTile.PEW: return [0x00, 0x00, 0x00, 0x00, 0xFF, 0x01, 0x01, 0xFF];
			case MapTile.GGG: return [0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00];

			case MapTile.PNW: return [0x90, 0x10, 0x10, 0xF0, 0x00, 0x00, 0x00, 0x00];
			case MapTile.PNE: return [0x09, 0x08, 0x08, 0x0F, 0x00, 0x00, 0x00, 0x00];
			case MapTile.PSW: return [0x00, 0x00, 0x00, 0x00, 0xF0, 0x10, 0x10, 0x90];
			case MapTile.PSE: return [0x00, 0x00, 0x00, 0x00, 0x0F, 0x08, 0x08, 0x09];

			case MapTile.INW: return [0x00, 0x00, 0x00, 0x07, 0x08, 0x10, 0x10, 0x10];
			case MapTile.INE: return [0x00, 0x00, 0x00, 0xE0, 0x10, 0x08, 0x08, 0x08];
			case MapTile.ISW: return [0x10, 0x10, 0x10, 0x08, 0x07, 0x00, 0x00, 0x00];
			case MapTile.ISE: return [0x08, 0x08, 0x08, 0x10, 0xE0, 0x00, 0x00, 0x00];

			case MapTile.NNW: return [0xFF, 0x00, 0x00, 0x07, 0x08, 0x10, 0x10, 0x10];
			case MapTile.NNE: return [0xFF, 0x00, 0x00, 0xE0, 0x10, 0x08, 0x08, 0x08];
			case MapTile.ENE: return [0x01, 0x01, 0x01, 0xE1, 0x11, 0x09, 0x09, 0x09];
			case MapTile.ESE: return [0x09, 0x09, 0x09, 0x11, 0xE1, 0x01, 0x01, 0x01];
			case MapTile.WNW: return [0x80, 0x80, 0x80, 0x87, 0x88, 0x90, 0x90, 0x90];
			case MapTile.WSW: return [0x90, 0x90, 0x90, 0x88, 0x87, 0x80, 0x80, 0x80];

			case MapTile.FFF: return [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];

			default:
			case MapTile.___: return [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
		}
	}

	export interface IColorOptions {
		BORDER;
		GATE;
		EMPTY;
		PELLET;
		PACMAN;
		BLINKY;
		PINKY;
		INKY;
		CLYDE;
	}

	export function getTileColor(tile: MapTile, colors: IColorOptions): number[] {
		switch (tile) {
			case MapTile.___: return colors.EMPTY.rgba;
			case MapTile.RUp: case MapTile._p_: case MapTile._E_: return colors.PELLET.rgba;
			case MapTile.GGG: return colors.GATE.rgba;
			case MapTile._PS: return colors.PACMAN.rgba;
			case MapTile.GSB: case MapTile.GTB: return colors.BLINKY.rgba;
			case MapTile.GSP: case MapTile.GTP: return colors.PINKY.rgba;
			case MapTile.GSI: case MapTile.GTI: return colors.INKY.rgba;
			case MapTile.GSC: case MapTile.GTC: return colors.CLYDE.rgba;
			default: return colors.BORDER.rgba;
		}
	}

	/**
	 * Use a bit mask to check if a bit is on or off. Specify which bit to check in what value
	 */
	export function isBitSet(bit: number, value: number): boolean {
		// tslint:disable-next-line:no-bitwise
		return !!(value & (1 << bit));
	}
}

export default MapTile;
