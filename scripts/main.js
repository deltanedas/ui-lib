require("ui-lib/library");

require("areas");

var ui = this.global.uiLib;

require("effects");

// Run events to add UI and stuff when assets are ready
function loaded() {
	var table;
	for (var i in ui.areas) {
		table = new Table();
		table.setFillParent(true);
		table.visible(boolp(() => Vars.ui.hudfrag.shown()));
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
		// Add the UI elements to the HUD
		Vars.ui.hudGroup.addChild(area.table);
	}
}

ui.once(() => {
	// Only hook the reload event once
	Events.on(EventType.ContentReloadEvent, run(() => {
		// Clear any old elements when reloading
		var area;
		for (var i in ui.areas) {
			area = ui.areas[i];
			area.table.clearChildren();
			if (area.reloaded) area.reloaded();
		}

		ui.effects = [];
	}));
}, loaded);
