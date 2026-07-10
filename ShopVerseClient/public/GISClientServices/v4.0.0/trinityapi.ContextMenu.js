	var contextMenuGteCoordinate = [];
	tmpl.ContextMenu.create = function (param) {
		var mapObj = param.map;
		var menu_items = param.menu_items;

		contextmenuobj = new ContextMenu({
			width: 170,
			default_items: true, //default_items are (for now) Zoom In/Zoom Out
			items: menu_items
		});
		mapObj.addControl(contextmenuobj);
		contextmenuobj.on('open', function (evt) {
			if (appConfigInfo.mapData == "google" || 'hereMaps') {
				contextMenuGteCoordinate = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
			}
			else {
				contextMenuGteCoordinate = evt.coordinate;
			}

		});
		return contextmenuobj;
		
	}

	tmpl.ContextMenu.addMenu = function (param) {
		var add_menu = param.add_menu;
		contextmenuobj.extend(add_menu);
	}

	tmpl.ContextMenu.clearMenu = function () {
		contextmenuobj.clear();
		$(".ol-ctx-menu-container").html("");
	}
	tmpl.ContextMenu.closeMenu = function () {
		contextmenuobj.close();
	}

	tmpl.ContextMenu.addMapToCenter = function (param) {
		var add_menu = param.add_menu;
		contextmenuobj.extend(add_menu);
	}

	tmpl.ContextMenu.singleGetCoordinate = function () {
		return contextMenuGteCoordinate;
	}

	tmpl.ContextMenu.getCoordinate = function (contextmenuobj, myCallBack) {
		contextmenuobj.on('open', function (evt) {
			if (appConfigInfo.mapData == "google" || 'hereMaps') {
				coordinate = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
			}
			else {
				coordinate = evt.coordinate;
			}
			myCallBack(coordinate); //new
		});
	}

	