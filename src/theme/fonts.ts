import { loadAsync } from 'expo-font';

export const fonts = {
    dMSans: {
        regular: 'dMSans_regular',
        regularItalic: 'dMSans_regular_italic',
        semiBold: 'dMSans_semiBold',
        semiBoldItalic: 'dMSans_semiBold_italic',
        bold: 'dMSans_bold',
        boldItalic: 'dMSans_bold_italic',

    },
    openSan: {
        regular: 'openSans_regular',
        regularItalic: 'openSans_regular_italic',
        semiBold: 'openSans_semiBold',
        semiBoldItalic: 'openSans_semiBold_italic',
        bold: 'openSans_bold',
        boldItalic: 'openSans_bold_italic',
    },
};

// preload fonts
export const loadFonts = () =>
    loadAsync({
        dMSans_regular: require('@assets/fonts/DMSans-Regular.ttf'),
        dMSans_regular_italic: require('@assets/fonts/DMSansItalic.ttf'),
        dMSans_semiBold: require('@assets/fonts/DMSans-Medium.ttf'),
        dMSans_semiBold_italic: require('@assets/fonts/DMSansMediumItalic.ttf'),
        dMSans_bold: require('@assets/fonts/DMSansBold.ttf'),
        dMSans_bold_italic: require('@assets/fonts/DMSansBoldItalic.ttf'),

        openSans_regular: require('@assets/fonts/OpenSans-Regular.ttf'),
        openSans_regular_italic: require('@assets/fonts/OpenSans-Italic.ttf'),
        openSans_semiBold: require('@assets/fonts/OpenSans-Semibold.ttf'),
        openSans_semiBold_italic: require('@assets/fonts/OpenSans-SemiboldItalic.ttf'),
        openSans_bold: require('@assets/fonts/OpenSans-Bold.ttf'),
        openSans_bold_italic: require('@assets/fonts/OpenSans-BoldItalic.ttf'),
    });
