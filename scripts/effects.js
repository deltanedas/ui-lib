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

ui.onLoad(() => {
	// Use one table to reduce setting Draw.scl
	const table = extend(Table, {
		draw() {
			const prev = Draw.scl;
			Draw.scl = 1;
			for (var i in ui.effects) {
				ui.effects[i](Core.graphics.width, Core.graphics.height);
			}
			Draw.scl = prev;
		}
	});

	ui.areas.effects.table.add(table).name("effect");
});
