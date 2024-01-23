// Contributors:
// Martin Vilche & Dylan Blanqué

function hslToHex(h, s, l) {
	l /= 100;
	const a = s * Math.min(l, 1 - l) / 100;
	const f = n => {
	  const k = (n + h / 30) % 12;
	  const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	  return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
	};
	let r = `#${f(0)}${f(8)}${f(4)}`;
	if (r == "#NaNNaNNaN")
		throw new Error(`Color parse error (Values: ${h}, ${s}, ${l}`);
	return r;
}

const vueColorList = {
	// color_name: [h, s, v]
	primary: [211, 54.5, 56.1],
	accent: [29.5, 100, 76.9],
	secondary: [210, 7.4, 21.2],
}

function parseVueColors() {
	let colors = {
		dark:{},
		light:{}
	}
	let limit = 95

	// Get the root element
	for (const color_key in vueColorList) {
		const color_hue = vueColorList[color_key][0]
		const color_sat = vueColorList[color_key][1]
		const color_lig = vueColorList[color_key][2]
		let default_color = hslToHex(color_hue, color_sat, color_lig)
		// dark
		colors.dark[color_key] = default_color
		// light
		colors.light[color_key] = default_color
		// Step saturation and lightness every 10
		for (var sat = 5; sat <= limit; sat +=5){
			for (var lig = 5; lig <= limit; lig +=5){
				let cur_clr = hslToHex(color_hue, sat, lig)
				colors.light[`${color_key}-${sat}-${lig}-s`] = cur_clr
				colors.dark[`${color_key}-${sat}-${lig}-s`] = cur_clr
				colors.light[`${color_key}-${sat}-${lig}`] = cur_clr
				colors.dark[`${color_key}-${sat}-${lig}`] = hslToHex(color_hue, sat, 100-lig)
			}
		}
	}
	return colors
}

export default parseVueColors