var ui = this.global.uiLib;

/* Create all the areas */

// To the right of the wave info / mobile buttons
ui.addArea("buttons", {
	init(buttons) {
		// 5 buttons in vanilla mobile, same width as the wave fragment
		// float HudFragment#dsize = 47.2f;
		buttons.top().left().marginLeft(47.2 * 5 + 4);
		buttons.defaults().size(47.2).left();
	},

	post(buttons) {
		// Edges around buttons TODO: fix right buttons moving away from bottom edge
		const count = buttons.cells.size;
		buttons.addImage().color(Pal.gray).width(4).fillY();
		buttons.row();
		buttons.addImage().color(Pal.gray).height(4).width(47.2 * count + 4).top();
	}
});

// Under the FPS counter.
ui.addArea("top", {
	init(top) {
		top.top().left().marginTop(47.2 + 32).marginLeft(47.2 * 5 + 16);
		top.defaults().top().left();
	},
	post(top) {},
	added(table) {
		if (this.first) {
			// avoid some clutter on the screen
			ui.addButton("top-visibility", Icon.rightOpen, button => this.toggle(button));
			this.first = false;
		}
		table.visible(boolp(() => this.shown));
	},

	toggle(button) {
		button.style.imageUp = this.shown ? Icon.leftOpen : Icon.rightOpen
		this.shown = !this.shown;
	},

	first: true,
	shown: true
});
