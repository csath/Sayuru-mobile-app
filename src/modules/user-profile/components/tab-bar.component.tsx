import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { scale, fontScale } from '../../../shared/utilities/scale';
import colors from '../../../shared/styles/colors';

export interface Props {
    tab1Name: string,
    tab2Name: string,
    selectedTab: number;
    onChangeTab: any
}

interface TabItemProps {
    isSelected: boolean,
    name: string,
    value?: number;
    onChangeTab?: any
}


const TabName = (props: TabItemProps) => {
    const { name, isSelected } = props;
    return (
        <Text style={[styles.txtBase, isSelected ? styles.selectedTxt : null]}
        >{name}
        </Text>
    );
};

const SelectedTab = (props: TabItemProps) => {
    const { isSelected, name, onChangeTab, value } = props;
    return (
        <TouchableOpacity
            style={[styles.tabItemBase, isSelected ? styles.selectedTabOuter : null]}
            onPress={() => { onChangeTab(value) }}
        >
            <TabName name={name} isSelected={isSelected} />
        </TouchableOpacity>
    );
};



const TabBar = (props: Props) => {
    const { tab1Name, tab2Name, selectedTab, onChangeTab } = props;
    return (
        <View style={styles.outerWrapper}>
            <SelectedTab
                value={1}
                isSelected={1 === selectedTab}
                name={tab1Name}
                onChangeTab={onChangeTab}
            />
            <SelectedTab
                value={2}
                isSelected={2 === selectedTab}
                name={tab2Name}
                onChangeTab={onChangeTab}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    outerWrapper: {
        backgroundColor: colors.paleGray,
        borderRadius: 23,
        flex: 1,
        flexDirection: "row",
        marginTop: scale(15),
        marginBottom: scale(15),
        height: scale(40)
    },
    tabItemBase: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 23,
        height: scale(40)

    },
    selectedTabOuter: {
        backgroundColor: colors.secondary
    },
    txtBase: {
        color: colors.disabledGrey,
        fontSize: fontScale(14),
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontWeight: "500"
    },
    selectedTxt: {
        color: colors.white
    }

});

export { TabBar };