require("ui-lib/library");

require("areas");

var ui = this.global.uiLib;

// Run events to add UI and stuff when assets are ready
function loaded() {
	var table;
	for (var i in ui.areas) {
		table = new Table();
		table.setFillParent(true);
		ui.areas[i].table = table;
		ui.areas[i].init(table);
	}

	const events = ui.loadEvents;
	ui.loaded = true;
	print("Set load to " + ui.loaded);
	for (var i in events) {
		events[i]();
	}
	// Don't call events multiple times when mods reload
	ui.loadEvents = [];

	// Add the UI elements to the HUD
	var area;
	for (var i in ui.areas) {
		area = ui.areas[i];
		area.table.visible(boolp(() => !Vars.state.is(GameState.State.menu)));
		area.post(area.table);
		Vars.ui.hudGroup.addChild(area.table);
	}
}

// UI is always loaded when reloading
if (Vars.ui.hudGroup) {
	loaded();
} else {
	Events.on(EventType.ClientLoadEvent, run(() => {
		// Only hook the event once
		Events.on(EventType.ContentReloadEvent, run(() => {
			// Clear any old elements when reloading
			var area;
			for (var i in ui.areas) {
				area = ui.areas[i];
				area.table.clear();
				if (area.reloaded) area.reloaded();
			}
		}));

		loaded();
	}));
}
