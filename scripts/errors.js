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

const ui = require("ui-lib/library");

ui.onLoad(() => {
	const dialog = extendContent(FloatingDialog, "$ui.error", {
		set(msg) {
			this.cont.cells.get(1).get().text = msg;
		}
	});

	const table = dialog.cont;
	table.add("$error.title");
	table.row();
	table.add("Success").size(500, 300).get().wrap = true;

	dialog.addCloseButton();
	ui.errors = dialog;
});

})();
