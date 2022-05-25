import LocalizedStrings from "react-native-localization";
import ENGLISH from './translations.english';
import SINHALA from './translations.sinhala';
import TAMIL from './translations.tamil';

const localize = new LocalizedStrings({
    "en": ENGLISH,
    "si": SINHALA,
    "ta": TAMIL
});

export default localize;
