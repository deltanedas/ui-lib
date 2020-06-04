if (this.global.uiLib) {
	module.exports = this.global.uiLib;
} else {

var ui = {
	// functions to be called when atlas is ready
	loadEvents: [],
	areas: {},
	emptyRun: run(() => {}),
	// if the loadEvents have started processing
	loaded: false
};

/* UTILITY FUNCTIONS */

/* Run a function when the client loads, or now if it already has. */
ui.onLoad = function(func) {
	if (ui.loaded) {
		func();
	} else {
		ui.loadEvents.push(func);
	}
}

/* Run a function once.
	Useful for hooking events.
	loading: (Optional)
		Called only when the client hasn't loaded yet.
	loaded: (Optional)
		Called every time.

	Returns whether the client has already loaded. */
ui.once = function(loading, loaded) {
	// Client has already loaded, mods reloaded and/or just installed now.
	if (Vars.ui.hudGroup) {
		if (loaded) loaded();
		return false;
	}

	Events.on(EventType.ClientLoadEvent, run(() => {
		if (loading) loading();
		if (loaded) loaded();
	}));
	return true;
}

ui.getIcon = function(icon) {
	// "error"
	if (typeof(icon) == "string") {
		icon = Core.atlas.find(icon);
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
}

/* Area is an object with these functions:
	init(Table):
		Called before any loadEvents.
		Argument is a shortcut for this.table.
	post(Table):
		Called after all loadEvents but before the area is added to the HUD.
		Argument is a shortcut for this.table.
	added(Table): (Optional)
		Called when a new table is added by ui.addTable.
	reloaded(): (Optional)
		Called when reloading mods.
		Elements are cleared automatically. */
ui.addArea = function(name, area) {
	ui.areas[name] = area;
}

/* UI FUNCTIONS */

/* Add a table to an area
	String area:
		Index to ui.areas that serves as the root.
		See areas.js.
	String name:
		Name of the table, used for sorting.
	function(Table) user:
		Called when the table is created. */
ui.addTable = function(area, name, user) {
	ui.onLoad(() => {
		const root = ui.areas[area].table;
		const table = new Table();
		root.add(table).name(name);
		root.row();
		if (ui.areas[area].added) ui.areas[area].added(table);
		user(table);
	});
}

/* Add a button to the top left.
	String name:
		Name of the button, used for sorting.
	Drawable icon:
		The icon of the button.
		Use Icon.xxx, a TextureRegion, UnlockableContent or String.
	function(ImageButton) clicked:
		Called when the button is clicked.
	function(ImageButton) user: (Optional)
		Called when the button is created. */
ui.addButton = (name, icon, clicked, user) => {
	ui.onLoad(() => {
		icon = ui.getIcon(icon);
		const cell = ui.areas.buttons.table.addImageButton(icon, Styles.clearTransi, 47.2, ui.emptyRun);
		cell.name(name);
		const button = cell.get();
		button.clicked(run(() => clicked(button)));
		if (user) user(cell);
	});
};

module.exports = ui;
this.global.uiLib = ui;
}
