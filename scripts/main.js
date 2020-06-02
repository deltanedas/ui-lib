require("ui-lib/library");

const buttons = require("buttons");

// Run events to add UI and stuff when assets load
Events.on(EventType.ClientLoadEvent, run(() => {
	var ui = this.global.uiLib;

	// load the root tables
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
		const count = table.cells.size;
		table.addImage().color(Pal.gray).width(4).fillY();
		table.row();
		table.addImage().color(Pal.gray).height(4).width(47.2 * count + 4).top();
		Vars.ui.hudGroup.addChild(table);
	}
}));
