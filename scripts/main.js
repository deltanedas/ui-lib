require("ui-lib/library");

require("areas");

// Run events to add UI and stuff when assets load
Events.on(EventType.ClientLoadEvent, run(() => {
	var ui = this.global.uiLib;

	var table;
	for (var i in ui.areas) {
		table = new Table();
		table.setFillParent(true);
		ui.areas[i].table = table;
		ui.areas[i].init(table);
	}

	const events = ui.loadEvents;
	ui.loaded = true;
	for (var i in events) {
		events[i]();
	}

	// Add the UI elements to the HUD
	var area;
	for (var i in ui.areas) {
		area = ui.areas[i];
		area.table.visible(boolp(() => !Vars.state.is(GameState.State.menu)));
		area.post(area.table);
		Vars.ui.hudGroup.addChild(area.table);
	}
}));
