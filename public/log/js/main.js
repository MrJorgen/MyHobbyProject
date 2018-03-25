var themes = [
	{ name: "Cerulean", link: "https://bootswatch.com/3/cerulean/bootstrap.css" },
	{ name: "Cosmo", link: "https://bootswatch.com/3/cosmo/bootstrap.css" },
	{ name: "Cyborg", link: "https://bootswatch.com/3/cyborg/bootstrap.css" },
	{ name: "Darkly", link: "https://bootswatch.com/3/darkly/bootstrap.css" },
	{ name: "Flatly", link: "https://bootswatch.com/3/flatly/bootstrap.css" },
	{ name: "Journal", link: "https://bootswatch.com/3/journal/bootstrap.css" },
	{ name: "Lumen", link: "https://bootswatch.com/3/lumen/bootstrap.css" },
	{ name: "Litera v4", link: "https://bootswatch.com/4/litera/bootstrap.css" },
	{ name: "Paper", link: "https://bootswatch.com/3/paper/bootstrap.css" },
	{ name: "Readable", link: "https://bootswatch.com/3/readable/bootstrap.css" },
	{ name: "Sandstone", link: "https://bootswatch.com/3/sandstone/bootstrap.css" },
	{ name: "Simplex", link: "https://bootswatch.com/3/simplex/bootstrap.css" },
	{ name: "Slate", link: "https://bootswatch.com/3/slate/bootstrap.css" },
	// { name: "Solar", link: "https://bootswatch.com/3/solar/bootstrap.css" },
	{ name: "Spacelab", link: "https://bootswatch.com/3/spacelab/bootstrap.css" },
	{ name: "Superhero", link: "https://bootswatch.com/3/superhero/bootstrap.css" },
	{ name: "United", link: "https://bootswatch.com/3/united/bootstrap.css" },
	{ name: "Yeti", link: "https://bootswatch.com/3/yeti/bootstrap.css" }];

document.addEventListener("DOMContentLoaded", function (event) {
	var navBarLinks = document.getElementById("navbar").getElementsByTagName("a");
	for (var i = 0; i < navBarLinks.length; i++) {
		if (location.href == navBarLinks[i].href) {
			navBarLinks[i].parentNode.classList.add("active");
		}
	}
	init();
});

function init() {
	if (location.pathname == "/log/index.php") {
		popCompaniesList();
		popPlacesList();
	}
	popFonts();

	// Set themes in dropdown menu.
	var themesElement = document.getElementById("themes");
	for (var i = 0; i < themes.length; i++) {

		var newThemeLi = document.createElement("li");

		newThemeLi.setAttribute("data-name", themes[i].name);
		newThemeLi.addEventListener("click", function () {
			changeCSS(this.getAttribute("data-name"));
		});
		newThemeA = document.createElement("a");
		newThemeA.href = "#";
		newThemeA.innerHTML = themes[i].name;
		newThemeLi.appendChild(newThemeA);
		themesElement.appendChild(newThemeLi);
	}
	if (localStorage.getItem("usersettings")) {
		var selectedTheme = JSON.parse(localStorage.getItem("usersettings"));
		changeCSS(selectedTheme.theme);
		if (selectedTheme.font) {
			setFont(selectedTheme.font);
		}
	}
}

function popFonts() {
	var allFonts = [], fontsStr = "";
	var fontLink = $("#fonts_link")[0].href;
	fontsStr = fontLink.split("=")[1];
	fontsStr = fontsStr.replace(/\+/g, " ");
	allFonts = fontsStr.split("|");
	allFonts.sort();
	for (var i = 0; i < allFonts.length; i++) {
		$("#fonts-menu").append('<li style="font-family: ' + allFonts[i] + ';" onclick="setFont(this.firstChild.innerText);"><a href="#">' + allFonts[i] + '</a></li>');
	}
}

function setFont(fontName) {
	document.body.style.fontFamily = fontName;
	userSettings({ font: fontName });
	$("#font").html(fontName + " <span class='caret'></span>");
}

// Change theme of the site using Bootswatch themes. Takes themename as param.
function changeCSS(themeName) {
	userSettings({ theme: themeName });
	var links = document.getElementsByTagName("link"), bootstrapLinkIndex = 0;

	for (var i = 0; i < links.length; i++) {
		if (links[i].href.includes("bootstrap")) {
			bootstrapLinkIndex = i;
			break;
		};
	};
	var oldlink = document.getElementsByTagName("link").item(bootstrapLinkIndex);

	var index = themes.findIndex(x => x.name == themeName);
	var newLink = themes[index].link;
	oldlink.setAttribute("href", newLink);

	document.getElementById("theme").innerHTML = themeName + " <span class='caret'></span>";
}

function toggleInverseDefault() {
	$(".navbar-default, .navbar-inverse").toggleClass("navbar-default").toggleClass("navbar-inverse");
	$(".btn-default, .btn-inverse").toggleClass("btn-default").toggleClass("btn-inverse");
}

function popCompaniesList() {
	var companies = ["Beijer", "El-Giganten", "K-Rauta", "Bauhaus", "Stena", "Suez", "Billerud", "Holmen Paper", "Holmen Timber",
		"Peterson Packaging", "DT Group", "Renova Pallservice", "Svevia", "Spendrups", "Coca-Cola", "Dagab", "Åhléns", "Pantamera", "Returpack"];

	companies = companies.sort();
	var x = document.getElementById("companyselect");

	for (var i = 0; i < companies.length; i++) {
		// Testar select element
		var option = document.createElement("option");
		option.text = companies[i];
		x.add(option);
	}
}

function popPlacesList() {
	var places = ["Norrköping", "Linköping", "Örebro", "Västerås", "Enköping", "Kalmar", "Västervik", "Eskilstuna", "Stängnäs", "Nykvarn",
		"Södertälje", "Knivsta", "Spånga", "Länna/Skogås", "Älvsjö", "Botkyrka", "Tumba", "Barkaby", "Upplands-Väsby", "Järfälla", "Jordbro", "Kungens Kurva", "Vårby"];

	places = places.sort();

	var x = document.getElementById("placeselect");

	for (var i = 0; i < places.length; i++) {
		var option = document.createElement("option");
		option.text = places[i];
		x.add(option);
	}
}

// Settings is an object containing usersetting ie: usersettings =  { theme: "Curlean", font: "Ubuntu" }
function userSettings(settings) {
	// Check if storage is present and use it
	var oldSettings = {
		font: null,
		theme: null
	};
	if (window.localStorage !== undefined) {
		if (settings !== undefined) {
			oldSettings = JSON.parse(localStorage.getItem("usersettings")) || { font: null, theme: null };
			console.log(oldSettings);
			if (settings.theme !== undefined) {
				oldSettings.theme = settings.theme;
			}
			if (settings.font !== undefined) {
				oldSettings.font = settings.font;
			}
			localStorage.setItem("usersettings", JSON.stringify(oldSettings));
		}
		else {
			return JSON.parse(localStorage.getItem("usersettings"));
		}
	}
}