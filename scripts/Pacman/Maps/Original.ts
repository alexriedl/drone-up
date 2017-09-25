import MT from './MapTile';
import Map from './Map';

export default class Original extends Map {
	public constructor() {
		super(tiles);
	}
}

// tslint:disable:max-line-length
const tiles = [
	[MT.___, MT.___, MT.GTP, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.GTB, MT.___, MT.___],
	[MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___],
	[MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___],
	[MT.DNW, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.NNE, MT.NNW, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DNE],
	[MT.DW_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT.SE_, MT.SW_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT.DE_],
	[MT.DW_, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.SE_, MT.SW_, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.DE_],
	[MT.DW_, MT._E_, MT.SE_, MT.___, MT.___, MT.SW_, MT._p_, MT.SE_, MT.___, MT.___, MT.___, MT.SW_, MT._p_, MT.SE_, MT.SW_, MT._p_, MT.SE_, MT.___, MT.___, MT.___, MT.SW_, MT._p_, MT.SE_, MT.___, MT.___, MT.SW_, MT._E_, MT.DE_],
	[MT.DW_, MT._p_, MT.SNE, MT.SN_, MT.SN_, MT.SNW, MT._p_, MT.SNE, MT.SN_, MT.SN_, MT.SN_, MT.SNW, MT._p_, MT.SNE, MT.SNW, MT._p_, MT.SNE, MT.SN_, MT.SN_, MT.SN_, MT.SNW, MT._p_, MT.SNE, MT.SN_, MT.SN_, MT.SNW, MT._p_, MT.DE_],
	[MT.DW_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT.DE_],
	[MT.DW_, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.SSE, MT.SSW, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SS_, MT.SS_, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.SSE, MT.SSW, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.DE_],
	[MT.DW_, MT._p_, MT.SNE, MT.SN_, MT.SN_, MT.SNW, MT._p_, MT.SE_, MT.SW_, MT._p_, MT.SNE, MT.SN_, MT.SN_, MT.INE, MT.INW, MT.SN_, MT.SN_, MT.SNW, MT._p_, MT.SE_, MT.SW_, MT._p_, MT.SNE, MT.SN_, MT.SN_, MT.SNW, MT._p_, MT.DE_],
	[MT.DW_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT.SE_, MT.SW_, MT._p_, MT._p_, MT._p_, MT._p_, MT.SE_, MT.SW_, MT._p_, MT._p_, MT._p_, MT._p_, MT.SE_, MT.SW_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT.DE_],
	[MT.DSW, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.SSW, MT._p_, MT.SE_, MT.ISW, MT.SS_, MT.SS_, MT.SSW, MT.___, MT.SE_, MT.SW_, MT.___, MT.SSE, MT.SS_, MT.SS_, MT.ISE, MT.SW_, MT._p_, MT.SSE, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DSE],
	[MT.___, MT.___, MT.___, MT.___, MT.___, MT.DW_, MT._p_, MT.SE_, MT.INW, MT.SN_, MT.SN_, MT.SNW, MT.___, MT.SNE, MT.SNW, MT.___, MT.SNE, MT.SN_, MT.SN_, MT.INE, MT.SW_, MT._p_, MT.DE_, MT.___, MT.___, MT.___, MT.___, MT.___],
	[MT.___, MT.___, MT.___, MT.___, MT.___, MT.DW_, MT._p_, MT.SE_, MT.SW_, MT.___, MT.___, MT.___, MT.RU_, MT.GSB, MT.RR_, MT.RU_, MT.___, MT.___, MT.___, MT.SE_, MT.SW_, MT._p_, MT.DE_, MT.___, MT.___, MT.___, MT.___, MT.___],
	[MT.___, MT.___, MT.___, MT.___, MT.___, MT.DW_, MT._p_, MT.SE_, MT.SW_, MT.___, MT.PSE, MT.DS_, MT.PEW, MT.GGG, MT.GGG, MT.PEE, MT.DS_, MT.PSW, MT.___, MT.SE_, MT.SW_, MT._p_, MT.DE_, MT.___, MT.___, MT.___, MT.___, MT.___],
	[MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.SNW, MT._p_, MT.SNE, MT.SNW, MT.___, MT.DE_, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.DW_, MT.___, MT.SNE, MT.SNW, MT._p_, MT.SNE, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_],
	[MT._s_, MT._s_, MT._s_, MT._s_, MT._s_, MT.___, MT._p_, MT.___, MT.___, MT.___, MT.DE_, MT.GSI, MT.___, MT.GSP, MT.___, MT.GSC, MT.___, MT.DW_, MT.___, MT.___, MT.___, MT._p_, MT.___, MT._s_, MT._s_, MT._s_, MT._s_, MT._s_],
	[MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.SSW, MT._p_, MT.SSE, MT.SSW, MT.___, MT.DE_, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.DW_, MT.___, MT.SSE, MT.SSW, MT._p_, MT.SSE, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_],
	[MT.___, MT.___, MT.___, MT.___, MT.___, MT.DW_, MT._p_, MT.SE_, MT.SW_, MT.___, MT.PNE, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.PNW, MT.___, MT.SE_, MT.SW_, MT._p_, MT.DE_, MT.___, MT.___, MT.___, MT.___, MT.___],
	[MT.___, MT.___, MT.___, MT.___, MT.___, MT.DW_, MT._p_, MT.SE_, MT.SW_, MT.___, MT.___, MT.___, MT.___, MT._FS, MT.___, MT.___, MT.___, MT.___, MT.___, MT.SE_, MT.SW_, MT._p_, MT.DE_, MT.___, MT.___, MT.___, MT.___, MT.___],
	[MT.___, MT.___, MT.___, MT.___, MT.___, MT.DW_, MT._p_, MT.SE_, MT.SW_, MT.___, MT.SSE, MT.SS_, MT.SS_, MT.SS_, MT.SS_, MT.SS_, MT.SS_, MT.SSW, MT.___, MT.SE_, MT.SW_, MT._p_, MT.DE_, MT.___, MT.___, MT.___, MT.___, MT.___],
	[MT.DNW, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.SNW, MT._p_, MT.SNE, MT.SNW, MT.___, MT.SNE, MT.SN_, MT.SN_, MT.INE, MT.INW, MT.SN_, MT.SN_, MT.SNW, MT.___, MT.SNE, MT.SNW, MT._p_, MT.SNE, MT.DN_, MT.DN_, MT.DN_, MT.DN_, MT.DNE],
	[MT.DW_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT.SE_, MT.SW_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT.DE_],
	[MT.DW_, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.SE_, MT.SW_, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.DE_],
	[MT.DW_, MT._p_, MT.SNE, MT.SN_, MT.INE, MT.SW_, MT._p_, MT.SNE, MT.SN_, MT.SN_, MT.SN_, MT.SNW, MT._p_, MT.SNE, MT.SNW, MT._p_, MT.SNE, MT.SN_, MT.SN_, MT.SN_, MT.SNW, MT._p_, MT.SE_, MT.INW, MT.SN_, MT.SNW, MT._p_, MT.DE_],
	[MT.DW_, MT._E_, MT._p_, MT._p_, MT.SE_, MT.SW_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT.RUp, MT._PS, MT.___, MT.RUp, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT.SE_, MT.SW_, MT._p_, MT._p_, MT._E_, MT.DE_],
	[MT.WSW, MT.SS_, MT.SSW, MT._p_, MT.SE_, MT.SW_, MT._p_, MT.SSE, MT.SSW, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SS_, MT.SS_, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.SSE, MT.SSW, MT._p_, MT.SE_, MT.SW_, MT._p_, MT.SSE, MT.SS_, MT.ESE],
	[MT.WNW, MT.SN_, MT.SNW, MT._p_, MT.SNE, MT.SNW, MT._p_, MT.SE_, MT.SW_, MT._p_, MT.SNE, MT.SN_, MT.SN_, MT.INE, MT.INW, MT.SN_, MT.SN_, MT.SNW, MT._p_, MT.SE_, MT.SW_, MT._p_, MT.SNE, MT.SNW, MT._p_, MT.SNE, MT.SN_, MT.ENE],
	[MT.DW_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT.SE_, MT.SW_, MT._p_, MT._p_, MT._p_, MT._p_, MT.SE_, MT.SW_, MT._p_, MT._p_, MT._p_, MT._p_, MT.SE_, MT.SW_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT.DE_],
	[MT.DW_, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.SS_, MT.SS_, MT.ISE, MT.ISW, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.SE_, MT.SW_, MT._p_, MT.SSE, MT.SS_, MT.SS_, MT.ISE, MT.ISW, MT.SS_, MT.SS_, MT.SS_, MT.SS_, MT.SSW, MT._p_, MT.DE_],
	[MT.DW_, MT._p_, MT.SNE, MT.SN_, MT.SN_, MT.SN_, MT.SN_, MT.SN_, MT.SN_, MT.SN_, MT.SN_, MT.SNW, MT._p_, MT.SNE, MT.SNW, MT._p_, MT.SNE, MT.SN_, MT.SN_, MT.SN_, MT.SN_, MT.SN_, MT.SN_, MT.SN_, MT.SN_, MT.SNW, MT._p_, MT.DE_],
	[MT.DW_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT._p_, MT.DE_],
	[MT.DSW, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DS_, MT.DSE],
	[MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___],
	[MT.GTC, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.___, MT.GTI],
];
