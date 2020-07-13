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
var ui = require("ui-lib/library");
require("areas");
require("effects");
require("clicks");
if (Vars.ui.hudGroup) {
	/* Add a dialog similar to the "stop" one that was in 6.0 */
	Core.app.post(run(() => {
		const dialog = new FloatingDialog("Restart Mindustry");
		dialog.cont.add("UI Lib requires Mindustry to be restarted to work.")
			.grow().wrap().get().setAlignment(Align.center);
		dialog.cont.row();
		dialog.cont.addButton("$ok", run(() => {
			Core.app.exit();
		}));
		dialog.fillParent = true;
		dialog.show();
	}));
	throw "look at the dialog";
}

Events.on(EventType.ClientLoadEvent, run(() => {
	ui.load();
}));
