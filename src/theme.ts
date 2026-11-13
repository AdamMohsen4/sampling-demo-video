import {loadFont as loadDmSans} from '@remotion/google-fonts/DMSans';
import {loadFont as loadArchivo} from '@remotion/google-fonts/Archivo';

const dm = loadDmSans('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin', 'latin-ext']});
const archivo = loadArchivo('normal', {weights: ['300', '500', '700'], subsets: ['latin', 'latin-ext']});

/** Pollflow's own faces and colours (flow-survey-webapp: base.css, globals.css --primary, the mark). */
export const theme = {
	body: dm.fontFamily,
	display: archivo.fontFamily,
	primary: '#5959F8',
	deep: '#3B34B8',
	ink: '#111827',
	muted: '#4B5563',
	canvas: '#EEEEF3',
	white: '#FFFFFF',
	green: '#047857',
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
