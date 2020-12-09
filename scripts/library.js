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

const ui = {
	// Functions to be called when atlas is ready
	loadEvents: [],
	// Functions to be called when the mouse is clicked
	clickEvents: [],
	areas: {},
	// Custom drawing functions
	effects: [],
	// Dialog used to show any runtime errors
	errors: null,
	// Dialog used to select items from a list
	selection: null,
	// if the loadEvents have started processing
	loaded: false
};

/** UTILITY FUNCTIONS **/

/* Run a function when the client loads, or now if it already has. */
ui.onLoad = func => {
	if (ui.loaded) {
		func();
	} else {
		ui.loadEvents.push(func);
	}
};

/* Run events to add UI and stuff when assets are ready. */
ui.load = () => {
	var table;
	for (var i in ui.areas) {
		table = new Table();
		table.fillParent = true;
		table.visibility = () => !Vars.ui.minimapfrag.shown();
		ui.areas[i].table = table;
		ui.areas[i].init(table);
	}

	ui.loaded = true;
	for (var e of ui.loadEvents) e();
	ui.loadEvents = [];

	var area;
	for (var i in ui.areas) {
		area = ui.areas[i];
		// Sort the cells by name
		area.table.cells.sortComparing(cell => {
			const name = cell.get().name;
			return name[0] == '$' ? Core.bundle.get(name.substr(1)) : name;
		});

		area.post(area.table);
		// Add the UI elements to the HUD by default
		if (area.group !== null) {
			(area.group || Vars.ui.hudGroup).addChild(area.table);
		}
	}
};

ui.getIcon = (icon) => {
	// () => Icon.leftSmall
	if (typeof(icon) == "function") {
		icon = icon();
	}
	// "admin" / "error"
	if (typeof(icon) == "string") {
		try {
			icon = Icon[icon]
		} catch (e) {
			icon = Core.atlas.find(icon);
		}
	}
	// Blocks.duo
	if (icon instanceof UnlockableContent) {
		icon = icon.icon(Cicon.full);
	}
	// Core.atlas.find("error")
	if (icon instanceof TextureRegion) {
		icon = new TextureRegionDrawable(icon);
	}
	// Hopefully its a Drawable by now
	return icon;
};

/* Area is an object with these functions:
	void init(Table):
		Called before any loadEvents.
		Argument is a shortcut for this.table.
	void post(Table):
		Called after all loadEvents but before the area is added to the HUD.
		Argument is a shortcut for this.table.
	void added(Table): (Optional)
		Called when a new table is added by ui.addTable. */
ui.addArea = (name, area) => {
	ui.areas[name] = area;
};

/** UI FUNCTIONS **/

/* Add a table to an area
	String area:
		Index to ui.areas that serves as the root.
		See areas.js.
	String name:
		Name of the table, used for sorting.
	void user(Table):
		Called when the table is created. */
ui.addTable = (area, name, user) => {
	ui.onLoad(() => {
		try {
			const root = ui.areas[area].table;
			const table = new Table();
			root.add(table).name(name);
			root.row();
			if (ui.areas[area].added) {
				ui.areas[area].added(table);
			}
			user(table);
		} catch (e) {
			ui.showError("Failed to add table " + name + " to area " + area, e);
		}
	});
};

/* Add a button to the top left.
	String name:
		Name of the button, used for sorting.
	Drawable icon:
		The icon of the button.
		Use Icon.xxx, a TextureRegion, UnlockableContent or String.
	void clicked(ImageButton):
		Called when the button is clicked.
	void user(Cell): (Optional)
		Called when the button is created. */
ui.addButton = (name, icon, clicked, user) => {
	ui.onLoad(() => {
		try {
			icon = ui.getIcon(icon);
			const cell = ui.areas.buttons.table.button(icon, Styles.clearTransi, 45, ()=>{});
			cell.name(name);
			const button = cell.get();
			if (clicked) {
				button.clicked(() => {
					/* UI crashes are only printed to stdout, not a crash log */
					try {
						clicked(button);
					} catch (e) {
						ui.showError("Error when clicking button " + name, e);
					}
				});
			}
			if (user) user(cell);
		} catch (e) {
			ui.showError("Failed to add button " + name, e);
		}
	});
};

/* Shortcut for adding an ImageTextButton to the menu area */
ui.addMenuButton = (name, icon, clicked, user) => {
	ui.addTable("menu", name, t => {
		t.button(name, ui.getIcon(icon), clicked).height(48).size(210, 84);
		if (user) user(t);
	});
};

/* Add a custom drawing functiom.
	function(int w, int h) effect:
		Called every frame in-game like a block's draw().
		Coordinates are in screen space, not world space.
		Textures are drawn at block scale.
		For convenience, w and h are the screen's width and height.
	boolean visible():
		Whether to draw the effect or not.
		By default only draws when in-game. */
ui.addEffect = (effect, visible) => {
	ui.effects.push({
		draw: effect,
		visible: visible || (() => {
			return !Vars.state.is(GameState.State.menu);
		})
	});
	return ui.effects.length - 1;
};

/** EXTRA UTILITIES */

/* Call the handler when the mouse is clicked somewhere.
	void handler(Vec2 screen, Vec2 world, boolean hasMouse):
		Called once when a mouse click is received.
		If the player clicked a UI element and !world, hasMouse is true.
	boolean world = false:
		Whether to ignore clicks that are over UI elements.

	Returns the index to ui.clickEvents should you need to cancel it,
	 use delete ui.clickEvents[index] if so. */
ui.click = (handler, world) => {
	ui.clickEvents.push({
		handler: handler,
		world: world
	});
	return ui.clickEvents.length - 1;
}

/* Show an error dialog.
	Similar to Vars.ui.showErrorMessage but it is only built once.
	String msg: Info about when the error was caught.
		Prepended to error, or used on its own if error is null.
	String/Exception error: message to show in the center of the dialog. */
ui.showError = (msg, error) => {
	if (error) {
		if (typeof(error) == "object") {
			error = error.message + "\n" + error.fileName + ": " + error.lineNumber;
		}

		msg = msg + ": " + error;
	}

	Log.err(msg);
	Core.app.post(() => {
		ui.errors.set(msg);
		ui.errors.show();
	});
};

/* TextAreas can't get newlines on Android, use the native text input.
	Does nothing on desktop.
	Not very useful for TextFields.

	TextField area:
		Field to get input for.
	void accepted(String text):
		Ran when the input is accepted.
	Object params / Object params():
		If a function, uses the output of that function.
		Fields of Input$TextInput that override the defaults of:
			multiline: true,
			accepted: set area.text and run accepted */
ui.mobileAreaInput = (area, accepted, params) => {
	if (!Vars.mobile) return;

	/* Constant params */
	if (typeof(params) != "function") {
		params = () => params;
	}

	area.update(() => {
		if (Core.scene.keyboardFocus == area) {
			Core.scene.keyboardFocus = null;

			const input = new Input.TextInput;
			input.multiline = true;
			input.accepted = text => {
				area.text = text;
				accepted(text);
			};
			Object.assign(input, params(area));

			Core.input.getTextInput(input);
		}
	});
};

/* Have the user select an option from a list.
	Values can be any type, but must be String[] if names isn't set.

	String title:
		Title of the dialog.
	Object[] values:
		Values returned when clicking a button.
	void selector(Object):
		Called when the user pressed a button.
		Object is values[i].
	String[] names / String names(int i, Object value):
		Array of names used in place of values.
		If a function, the name of a button will be the return value of it.
		Value is values[i] and i is the button index in the list. */
ui.select = (title, values, selector, names) => {
	if (values instanceof Seq) {
		values = values.toArray();
	}

	if (!names) names = values;
	if (typeof(names) != "function") {
		const arr = names;
		names = i => arr[i];
	}

	Core.app.post(() => {
		ui.selection.rebuild(title, values, selector, names);
		ui.selection.show();
	});
}

module.exports = ui;
global.ui = ui;
