// /workspaces/claude-workspace/fitnessapp/src/components/onboarding/ScrollPicker.tsx
import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewToken,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

interface Props {
  values: number[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  unit: string;
  itemHeight?: number;
}

const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 3;

export const ScrollPicker: React.FC<Props> = ({
  values,
  selectedValue,
  onValueChange,
  unit,
  itemHeight = ITEM_HEIGHT,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const isScrollingRef = useRef(false);

  const selectedIndex = values.indexOf(selectedValue);

  useEffect(() => {
    if (flatListRef.current && selectedIndex >= 0 && !isScrollingRef.current) {
      flatListRef.current.scrollToIndex({
        index: selectedIndex,
        animated: false,
      });
    }
  }, [selectedIndex]);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const middleItem = viewableItems[Math.floor(viewableItems.length / 2)];
        if (middleItem && middleItem.item !== undefined) {
          onValueChange(middleItem.item);
        }
      }
    },
    [onValueChange]
  );

  const handleScrollBegin = () => {
    isScrollingRef.current = true;
  };

  const handleScrollEnd = () => {
    isScrollingRef.current = false;
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1));

    if (values[clampedIndex] !== undefined) {
      onValueChange(values[clampedIndex]);
    }

    flatListRef.current?.scrollToIndex({
      index: clampedIndex,
      animated: true,
    });

    isScrollingRef.current = false;
  };

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const isSelected = item === selectedValue;
    const distance = Math.abs(index - selectedIndex);
    const opacity = isSelected ? 1 : distance === 1 ? 0.4 : 0.2;
    const scale = isSelected ? 1 : 0.8;

    return (
      <View style={[styles.item, { height: itemHeight }]}>
        <Text
          style={[
            styles.itemText,
            { opacity, transform: [{ scale }] },
            isSelected && styles.itemTextSelected,
          ]}
        >
          {item}
          <Text style={styles.unitText}>{unit}</Text>
        </Text>
      </View>
    );
  };

  const getItemLayout = (_: any, index: number) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });

  return (
    <View style={[styles.container, { height: itemHeight * VISIBLE_ITEMS }]}>
      <View style={[styles.selectedIndicator, { top: itemHeight, height: itemHeight }]} />
      <FlatList
        ref={flatListRef}
        data={values}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{
          paddingVertical: itemHeight,
        }}
        initialScrollIndex={selectedIndex >= 0 ? selectedIndex : 0}
        onScrollToIndexFailed={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  selectedIndicator: {
    position: 'absolute',
    left: SPACING.xl,
    right: SPACING.xl,
    backgroundColor: COLORS.gray[800],
    borderRadius: 12,
    zIndex: -1,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '300',
    color: COLORS.gray[500],
  },
  itemTextSelected: {
    fontWeight: '400',
    color: COLORS.white,
  },
  unitText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '400',
  },
});
