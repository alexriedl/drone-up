enum MT {
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
	_PS, // Pac Start
	_FS, // Fruit Start
	GSB, // Ghost Start Blinky
	GSP, // Ghost Start Pinky
	GSI, // Ghost Start Inky
	GSC, // Ghost Start Clyde

	// Pacs
	_p_, // Pac
	_E_, // Energizer

	// Special
	_s_, // Slow (Empty)
	RU_, // Restrict Up
	RR_, // Restrict Right
	RUp, // Restrict Up (with a pac)
	GTB, // Ghost Target Blinky
	GTP, // Ghost Target Pinky
	GTI, // Ghost Target Inky
	GTC, // Ghost Target Clyde

	// Extra
	FFF, // Full
	___, // Empty
}

export default MT;
