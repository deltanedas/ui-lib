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

const ui = this.global.uiLib;

ui.onLoad(() => {
	const dialog = extendContent(Dialog, "", {
		set(msg) {
			this.cont.cells.get(2).get().text = msg;
		}
	});

	const table = dialog.cont;
	table.fillParent = true;
	table.margin(15);
	table.add("$error.title");
	table.row();
	table.image().size(300, 4).pad(2).color(Color.scarlet);
	table.row();
	table.add("Success").pad(2).growX().wrap()
		.get().alignment = Align.center;
	table.row();
	table.button("$ok", () => dialog.hide()).size(120, 50).pad(4);

	ui.errors = dialog;
});
