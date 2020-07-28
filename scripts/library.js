/*
	Copyright (c) DeltaNedas 2020

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

(() => {

if (this.global.uiLib) {
	module.exports = this.global.uiLib;
	return;
}

const ui = {
	// Functions to be called when atlas is ready
	loadEvents: [],
	// Functions to be called when the mouse is clicked
	clickEvents: [],
	areas: {},
	// Custom drawing functions
	effects: [],
	emptyRun: run(() => {}),
	// if the loadEvents have started processing
	loaded: false
};

/* UTILITY FUNCTIONS */

/* Run a function when the client loads, or now if it already has. */
ui.onLoad = (func) => {
	if (ui.loaded) {
		func();
	} else {
		ui.loadEvents.push(func);
	}
}

/* Run events to add UI and stuff when assets are ready. */
ui.load = () => {
	var table;
	for (var i in ui.areas) {
		table = new Table();
		table.setFillParent(true);
		table.visible(boolp(() => Vars.ui.hudfrag.shown() && !Vars.ui.minimapfrag.shown()));
		ui.areas[i].table = table;
		ui.areas[i].init(table);
	}

	const events = ui.loadEvents;
	ui.loaded = true;
	for (var i in events) {
		events[i]();
	}
	// Don't call events multiple times when mods reload
	ui.loadEvents = [];

	var area;
	for (var i in ui.areas) {
		area = ui.areas[i];
		// Sort the cells by name
		area.table.cells.sortComparing(func(cell => cell.get().name));

		area.post(area.table);
		// Add the UI elements to the HUD by default
		if (!area.customGroup) {
			Vars.ui.hudGroup.addChild(area.table);
		}
	}
};

ui.getIcon = (icon) => {
	// () => Icon.leftSmall
	if (typeof(icon) == "function") {
		icon = icon();
	}
	// "admin" / "error"
	if (typeof(icon) == "string") {
		try {
			icon = Icon[icon]
		} catch (e) {
			icon = Core.atlas.find(icon);
		}
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

/* Area is an object with these functions:
	init(Table):
		Called before any loadEvents.
		Argument is a shortcut for this.table.
	post(Table):
		Called after all loadEvents but before the area is added to the HUD.
		Argument is a shortcut for this.table.
	added(Table): (Optional)
		Called when a new table is added by ui.addTable. */
ui.addArea = (name, area) => {
	ui.areas[name] = area;
};

/* UI FUNCTIONS */

/* Add a table to an area
	String area:
		Index to ui.areas that serves as the root.
		See areas.js.
	String name:
		Name of the table, used for sorting.
	function(Table) user:
		Called when the table is created. */
ui.addTable = (area, name, user) => {
	ui.onLoad(() => {
		const root = ui.areas[area].table;
		const table = new Table();
		root.add(table).name(name);
		root.row();
		if (ui.areas[area].added) ui.areas[area].added(table);
		user(table);
	});
};

/* Add a button to the top left.
	String name:
		Name of the button, used for sorting.
	Drawable icon:
		The icon of the button.
		Use Icon.xxx, a TextureRegion, UnlockableContent or String.
	function(ImageButton) clicked:
		Called when the button is clicked.
	function(Cell) user: (Optional)
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

/* Shortcut for adding an ImageTextButton to the menu area */
ui.addMenuButton = (name, icon, clicked, user) => {
	ui.addTable("menu", name, t => {
		t.addImageTextButton(name, ui.getIcon(icon), run(clicked)).height(48);
	}, user).size(210, 84);
};

/* Add a custom drawing functiom.
	function(int w, int h) effect:
		Called every frame in-game like a block's draw().
		Coordinates are in screen space, not world space.
		Textures are drawn at block scale.
		For convenience, w and h are the screen's width and height. */
ui.addEffect = effect => {
	ui.effects.push(effect);
};

/* Call the handler when the mouse is clicked somewhere.
	function(Vec2 pos, Tile tile, boolean hasMouse) handler:
		Called once when a mouse click is received.
		Tile is null when not playing or out of map.
		If the player clicked a UI element and !world, hasMouse is true.
	boolean world = false:
		Whether to ignore clicks that are over UI elements.

	Returns the index to ui.clickEvents should you need to cancel it. */
ui.click = (handler, world) => {
	ui.clickEvents.push({
		handler: handler,
		world: world
	});
	return ui.clickEvents.length - 1;
}

module.exports = ui;
this.global.uiLib = ui;

})();
