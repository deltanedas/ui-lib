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

// TODO: find a proper way to run a function once
ui.once(null, () => {
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
	loaded()
});
