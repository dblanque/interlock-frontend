// Contributors:
// Martin Vilche & Dylan Blanqué
// ! IMPORTANT: Remember to set the following options in your theme.options
// customProperties: true
// variations: false

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
	default_themes:{
		primary: [211, 54.5, 56.1],
		accent: [29.5, 100, 76.9],
		secondary: [210, 7.4, 21.2],
		valid: [150, 86.9, 41.8],
		error: [0, 85.9, 45.5],
	},
	custom_themes:{
		// raven: {
		// 	colors:{
		// 		primary: [0, 54.5, 56.1],
		// 		accent: [120, 100, 76.9],
		// 	}
		// }
	}
}

function generateDefaultColorVariants(color_key, hsv_array, colors, parser_options) {
	const default_hue = hsv_array[0]
	const default_sat = hsv_array[1]
	const default_lig = hsv_array[2]
	let default_color_light = hslToHex(default_hue, default_sat, default_lig)
	let default_color_dark = hslToHex(default_hue, default_sat, 100-default_lig)
	// light
	colors.light[color_key] = default_color_light
	colors.light[`${color_key}-s`] = default_color_light
	// dark
	colors.dark[color_key] = default_color_dark
	colors.dark[`${color_key}-s`] = default_color_light
	// Step saturation and lightness
	for (let lig = parser_options.lig_steps; lig < parser_options.limit; lig +=parser_options.lig_steps){
		let cur_clr_default_sat = hslToHex(default_hue, default_sat, lig)
		// Varying Lightness, default saturation, static
		colors.light[`${color_key}-${lig}-s`] = cur_clr_default_sat
		colors.dark[`${color_key}-${lig}-s`] = cur_clr_default_sat
		// Varying Lightness, default Saturation, dynamic
		colors.light[`${color_key}-${lig}`] = cur_clr_default_sat
		colors.dark[`${color_key}-${lig}`] = hslToHex(default_hue, default_sat, 100-lig)
		if (parser_options.add_saturation_variants) {
			for (let sat = parser_options.sat_steps; sat <= parser_options.limit; sat += parser_options.sat_steps) {
				let cur_clr_light = hslToHex(default_hue, sat, lig)
				let cur_clr_dark = hslToHex(default_hue, sat, lig)
				// Static Lightness (Ignores Theme)
				colors.light[`${color_key}-${lig}-${sat}-s`] = cur_clr_light
				colors.dark[`${color_key}-${lig}-${sat}-s`] = cur_clr_light
				// Dynamic Lightness (Theme Dependant)
				colors.light[`${color_key}-${lig}-${sat}`] = cur_clr_light
				colors.dark[`${color_key}-${lig}-${sat}`] = cur_clr_dark
			}
		}
	}
	return colors
}

function generateCustomColorVariants(color_key, hsv_array, colors, parser_options, theme_name) {
	const default_hue = hsv_array[0]
	const default_sat = hsv_array[1]
	const default_lig = hsv_array[2]
	let default_color = hslToHex(default_hue, default_sat, default_lig)
	colors[theme_name][color_key] = default_color
	// Step saturation and lightness
	for (let lig = parser_options.lig_steps; lig < parser_options.limit; lig +=parser_options.lig_steps){
		let cur_clr_default_sat = hslToHex(default_hue, default_sat, lig)
		// Varying Lightness, default saturation, static
		colors[theme_name][`${color_key}-${lig}-s`] = cur_clr_default_sat
		// Varying Lightness, default Saturation, dynamic
		colors[theme_name][`${color_key}-${lig}`] = cur_clr_default_sat
		if (parser_options.add_saturation_variants) {
			for (let sat = parser_options.sat_steps; sat <= parser_options.limit; sat += parser_options.sat_steps) {
				let cur_clr = hslToHex(default_hue, sat, lig)
				// Static Lightness (Ignores Theme)
				colors[theme_name][`${color_key}-${lig}-${sat}-s`] = cur_clr
				// Dynamic Lightness (Theme Dependant)
				colors[theme_name][`${color_key}-${lig}-${sat}`] = cur_clr
			}
		}
	}
	return colors
}

// To get a Vue Color as a CSS Variable
// var(--v-variablename-base)
function parseVueColors() {
	let colors = {
		dark:{
			"background":hslToHex(210, 7.4, 21.2),
			"text-background":hslToHex(0,0,0),
			"text-inverted":hslToHex(0,0,100)
		},
		light:{
			"background":hslToHex(0,0,94.5),
			"text-background":hslToHex(0,0,100),
			"text-inverted":hslToHex(0,0,0)
		},
	}
	let parser_options = {
		limit: 100,
		lig_steps: 5,
		// If enabled, adds saturation variants for each color lightness.
		add_saturation_variants: true, // Be aware, this VERY heavily multiplies color compute time.
		sat_steps: 25
	}

	for (const color_key in vueColorList.default_themes) {
		colors = generateDefaultColorVariants(
			color_key,
			vueColorList.default_themes[color_key],
			colors,
			parser_options
		)
	}

	for (const theme in vueColorList.custom_themes) {
		colors[theme] = {}
		const theme_colors = vueColorList.custom_themes[theme].colors
		for (const color_key in theme_colors) {
			colors = generateCustomColorVariants(
				color_key,
				theme_colors[color_key],
				colors,
				parser_options,
				theme
			)
		}
	}
	console.log("Vue Default Theme Colors Generated")
	console.log(colors)
	console.log(Object.keys(colors.dark).length + Object.keys(colors.light).length)
	return colors
}

export {
	parseVueColors,
	vueColorList
};