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
		// Edges around buttons
		const count = buttons.cells.size;
		if (count == 0) return;

		buttons.addImage().color(Pal.gray).width(4).fillY();
		buttons.row();
		// Position it after the first button because it gets "caught" on the second
		const bottom = new Table().marginLeft(47.2 * count - 43.2).top();
		bottom.addImage().color(Pal.gray).height(4).width(47.2 * count + 4).right();
		buttons.add(bottom);
	}
});

// Under the FPS counter.
ui.addArea("top", {
	init(top) {
		top.top().left().marginTop(47.2 + 54).marginLeft(47.2 * 5 + 16);
		top.defaults().top().left();
	},
	post(top) {},
	added(table) {
		if (this.first) {
			// avoid some clutter on the screen
			ui.addButton("!!!top-visibility", Icon.upOpen, button => this.toggle(button));
			this.first = false;
		}
		table.visible(boolp(() => this.shown));
	},
	reloaded() {
		// Don't add dupe buttons
		this.first = this.shown = false;
	},

	toggle(button) {
		button.style.imageUp = this.shown ? Icon.upOpen : Icon.downOpen
		this.shown = !this.shown;
	},

	first: true,
	shown: false
});

ui.addArea("side", {
	init(side) {
		const base = Vars.mobile ? 47.2 * 2 : 47.2;
		const mtop = base + 130 + 8;
		side.top().left().marginTop(mtop).marginLeft(8);
		side.defaults().top().left();
	},
	post(side) {},
	added(table) {
		if (this.first) {
			// avoid some clutter on the screen
			ui.addButton("!!!side-visibility", Icon.leftOpen, button => this.toggle(button));
			this.first = false;
		}
		table.visible(boolp(() => this.shown));
	},
	reloaded() {
		// Don't add dupe buttons
		this.first = this.shown = false;
	},

	toggle(button) {
		button.style.imageUp = this.shown ? Icon.leftOpen : Icon.rightOpen
		this.shown = !this.shown;
	},
	first: true,
	shown: false
});

ui.addArea("bottom", {
	init(bottom) {
		bottom.bottom().left();
	},
	post() {}
});

// Custom drawing functions
ui.addArea("effects", {
	init() {},
	post() {}
});
