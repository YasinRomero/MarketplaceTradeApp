const fs = require("fs");
const path = require("path");
const https = require("https");

const icons = [
	"school",
	"notifications_unread",
	"chat_bubble",
	"add",
	"distance",
	"account_circle",
	"publish",
	"shield_lock",
	"verified",
	"photo_camera",
	"videocam",
	"upload",
	"tune",
	"keyboard_arrow_down",
	"sell",
	"swap_horiz",
	"swap_calls",
	"info",
	"news",
	"search",
	"domain",
	"close",
	"menu_book",
	"laptop_chromebook",
	"experiment",
	"chair",
	"sports_basketball",
	"id_card_2",
	"gavel",
	"login",
	"verified_user",
	"change_circle",
	"shopping_bag",
	"security",
	"deployed_code",
	"kid_star",
	"chronic",
	"zoom_in",
	"chevron_forward",
	"chevron_backward",
];

const outputDir = path.join(__dirname, "../src/components/icons_svg");

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, {
		recursive: true,
	});
}

function downloadIcon(name) {
	const url = `https://raw.githubusercontent.com/marella/material-symbols/main/svg/400/rounded/${name}.svg`;

	const destination = path.join(outputDir, `${name}.svg`);

	const file = fs.createWriteStream(destination);

	https.get(url, (response) => {
		if (response.statusCode !== 200) {
			console.log(`❌ ${name} - ${response.statusCode}`);

			file.close();
			if (fs.existsSync(destination)) {
				fs.unlinkSync(destination);
			}

			return;
		}

		response.pipe(file);

		file.on("finish", () => {
			file.close();

			console.log(`✅ ${name}`);
		});
	});
}

icons.forEach(downloadIcon);
