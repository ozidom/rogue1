var GameText = {
	init : function (){},
	_help: function() {
		return "help...";
	},
	_about: function() {
		return "about...";
	},
	_menu: function() {
		var menuArray = [];
		menuArray[0] = "%c{yellow}Rogue 1";
		menuArray[1] = "%c{blue}=======";
        menuArray[2] =  "Press [1] to go play";
        menuArray[3] =  "Press [2] for help";
        menuArray[4] =  "Press [3] to find out how this was made";
        menuArray[5] =  "Press [4] to find out about RogueLikes";
        menuArray[6] =  "Press [5] to find out about ProcJam";
        menuArray[7] = "Press [6] to find out RogueLikeRadio";
		return menuArray;
	}
}