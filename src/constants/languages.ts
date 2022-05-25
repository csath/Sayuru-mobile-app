import { ENGLISH, ENGLISH_Label, SINHALA, SINHALA_Label, TAMIL, TAMIL_Label } from "../localization/localization.keys";
import localize from "../localization/translations";

export const LANGUAGES = localize.getAvailableLanguages().map(e => {
    if (e == ENGLISH) {
        return ({
            key: ENGLISH,
            label: ENGLISH_Label,
        })
    }
    if (e == SINHALA) {
        return ({
            key: SINHALA,
            label: SINHALA_Label,
        })
    }
    if (e == TAMIL) {
        return ({
            key: TAMIL,
            label: TAMIL_Label,
        })
    }
}).filter(e => !!e);