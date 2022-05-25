import { Dimensions, PixelRatio } from 'react-native';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scaleWidthDevice = SCREEN_WIDTH / 300;
const scaleHeightDevice = SCREEN_HEIGHT / 600;
const IS_SMALL_DEVICE = (scaleWidthDevice < 1 || scaleHeightDevice < 1);

const pixelRatio = PixelRatio.get();
const pixelRatioFontScale = PixelRatio.getFontScale();

const scale = (size: number) => scaleWidthDevice < 1 ? scaleWidthDevice * (size - 1) : scaleHeightDevice < 1 ? scaleHeightDevice * (size - 3) : size;
const fontScale = (size: number) => scaleWidthDevice < 1 ? (pixelRatioFontScale) * (size - 0.5) : size;

export { scale, fontScale, IS_SMALL_DEVICE };
