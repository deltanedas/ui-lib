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

const ui = global.ui;

// Sometimes being explicit about types is needed
if (typeof(cons) == "undefined") {
	const cons = method => extend(Cons, {get: method});
}

/* Create all the areas */

// To the right of the wave info / mobile buttons
ui.addArea("buttons", {
	init(buttons) {
		buttons.top().left();
		// Be obviously modded
		buttons.defaults().size(45).left();
		buttons.visibility = () => Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown();
	},

	post(buttons) {
		// Edges around buttons
		const count = buttons.cells.size;
		if (count == 0) return;

		// Not sure why this is needed
		Core.app.post(() => {
			// Dynamically set the margin to not overlap with the waves table
			const waves = Core.scene.find("waves");
			buttons.update(() => {
				buttons.marginLeft(waves.getPrefWidth() / Scl.scl());
			});
			if (!Vars.mobile) {
				const info = Core.scene.find("fps/ping");
				info.update(() => {
					info.translation.y = -Scl.scl(45 + 4);
				});
			}
		});

		/* Add edges around the buttons */
		buttons.image().color(Pal.gray).width(4).fillY()
			.get().touchable = Touchable.disabled;
		buttons.row();
		buttons.image().color(Pal.gray).size(45 * count + 4, 4).left()
			.colspan(buttons.columns).get().touchable = Touchable.disabled;
	}
});

// Under the FPS counter.
ui.addArea("top", {
	init(top) {
		top.top().left().marginTop(65 + 54).marginLeft(65 * 5 + 16);
		top.defaults().top().left().padBottom(8);
	},
	post(top) {},
	added(table) {
		if (this.first) {
			// avoid some clutter on the screen
			ui.addButton("!!!top-visibility", Icon.upOpen, button => this.toggle(button));
			this.first = false;
		}
		table.visibility = () => this.shown;
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
		const base = Vars.mobile ? 65 * 2 : 65;
		const mtop = base + 130 + 8;
		side.top().left().marginTop(mtop).marginLeft(8);
		side.defaults().top().left().padBottom(8);
	},
	post(side) {},
	added(table) {
		if (this.first) {
			// avoid some clutter on the screen
			ui.addButton("!!!side-visibility", Icon.leftOpen, button => this.toggle(button));
			this.first = false;
		}
		table.visibility = () => this.shown;
	},

	toggle(button) {
		button.style.imageUp = this.shown ? Icon.leftOpen : Icon.rightOpen
		this.shown = !this.shown;
	},
	first: true,
	shown: false
});
// Logical alias
ui.areas.left = ui.areas.side;

ui.addArea("bottom", {
	init(bottom) {
		bottom.bottom().left();
	},
	post() {}
});

/* Button to open a dialog only visible from the menu screen */
ui.addArea("menu", {
	init(table) {
		this.dialog = new BaseDialog("$ui.more");
		this.dialog.addCloseButton();

		const pane = new ScrollPane(table);
		table.defaults().pad(6);
		this.dialog.cont.add(pane).grow();

		if (Vars.mobile) {
			var parent = new WidgetGroup();
			parent.fillParent = true;
			parent.touchable = Touchable.childrenOnly;
			Vars.ui.menuGroup.addChild(parent);
			this.mobileButton(parent);
		} else {
			this.desktopButton(Vars.ui.menuGroup.children.get(0));
		}
	},

	post() {},

	buildDesktop(parent) {
		// Basically clearMenut
		const style = new TextButton.TextButtonStyle(Styles.cleart);
		style.up = Tex.clear;
		style.down = Styles.flatDown;

		// menufrag.container's first table
		const buttons = parent.children.get(1).cells.get(1).get();
		/* Specialized version of menufrag.buttons(buttons, new Buttoni(...)) */
		buttons.button("$ui.more", Icon.add, style, () => {
			this.dialog.show();
		}).marginLeft(11);
	},

	desktopButton(parent) {
		if (Core.assets.progress != 1) {
			Core.app.post(() => {
				this.desktopButton(parent);
			});
			return;
		}

		// ClientLauncher has a 6-long post snek, one-up it.
		Time.run(7, () => {
			this.buildDesktop(parent);
			Events.on(ResizeEvent, () => {
				this.buildDesktop(parent);
			});
		});
	},

	mobileButton(parent) {
		const style = new TextButton.TextButtonStyle(
			Tex.buttonEdge4,
			Tex.buttonEdgeOver4,
			Tex.buttonEdge4,
			Fonts.def);

		parent.fill(cons(button => {
			button.button("$ui.more", () => this.dialog.show())
				.top().left().grow().size(84, 45).get().setStyle(style);
		}));
	},

	group: null,

	dialog: null
});
