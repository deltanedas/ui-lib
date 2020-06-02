const ui = require("ui-lib/library");

const buttons = require("buttons");

// Run events to add UI and stuff when assets load
Events.on(EventType.ClientLoadEvent, run(() => {
	buttons();
	const events = ui.loadEvents;
	for (var i in events) {
		events[i]();
	}

	// Add the UI elements to the screen
	var table;
	for (var i in ui.tables) {
		table = ui.tables[i];
		table.visible(boolp(() => !Vars.state.is(GameState.State.menu)));
		// Edges
		table.addImage().color(Pal.gray).width(4).fillY();
		table.row();
		table.addImage().color(Pal.gray).height(4).top().fillX();
		Core.scene.add(table);
	}
}));
