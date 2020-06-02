if (this.global.uiLib) {
	module.exports = this.global.uiLib;
} else {

const ui = {
	// functions to be called when atlas is ready
	loadEvents: [],
	// object of root tables for buttons, top, side, etc.
	tables: {},
	emptyRun: run(() => {})
};

/* UTILITY FUNCTIONS */

ui.getIcon = (icon) => {
	// "admin" / "error"
	if (typeof(icon) == "string") {
		icon = Icon[icon] || Tex[icon] || Core.atlas.find(icon);
	}
	// Blocks.duo
	if (icon instanceof UnlockableContent) {
		icon = icon.icon(Cicon.full);
	}
	// Core.atlas.find("error")
	if (icon instanceof TextureRegion) {
		icon = new TextureRegionDrawable(icon);
	}
	// Hopefully its a Drawable by now
	return icon;
};

/* UI FUNCTIONS */

/* Add a button to the top left.
	String name:
		Name of the button, used for sorting.
	Drawable icon:
		The icon of the button.
		Use Icon.xxx, a TextureRegion, UnlockableContent or String.
	function(ImageButton) clicked:
		Called when the button is clicked. */
ui.addButton = (name, icon, clicked) => {
	ui.loadEvents.push(() => {
		print("Icon was " + icon);
		icon = ui.getIcon(icon);
		print("Icon is " + icon);
		const cell = ui.tables.buttons.addImageButton(icon, Styles.clearTransi, ui.emptyRun);
		cell.name(name);
		const button = cell.get();
		button.clicked(run(() => clicked(button)));
		return cell;
	});
};

module.exports = ui;
this.global.uiLib = ui;
}
