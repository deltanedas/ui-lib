// Create the root table for buttons
module.exports = () => {
	const buttons = new Table();
	buttons.setFillParent(true);
	// 5 buttons in vanilla mobile, same width as the wave fragment
	buttons.top().left().marginLeft(47.2 * 5 + 4);
	// HudFragment#dsize
	buttons.defaults().size(47.2).left();
	ui.tables.buttons = buttons;
};
