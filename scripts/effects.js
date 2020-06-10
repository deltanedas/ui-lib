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
