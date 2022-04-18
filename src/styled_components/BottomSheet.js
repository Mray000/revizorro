import React, {Component} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Animated,
  StyleSheet,
  PanResponder,
  Text,
} from 'react-native';
import {verticalScale} from '../utils/normalize';

class BottomSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      animatedHeight: new Animated.Value(0),
      pan: new Animated.ValueXY(),
    };

    this.createPanResponder(props);
  }

  setModalVisible(visible) {
    const {closeFunction, height} = this.props;
    const {animatedHeight, pan} = this.state;
    if (visible) {
      this.setState({modalVisible: visible});
      Animated.timing(animatedHeight, {
        toValue: height,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        pan.setValue({x: 0, y: 0});
        this.setState({
          modalVisible: visible,
          animatedHeight: new Animated.Value(0),
        });
        if (typeof closeFunction === 'function') closeFunction();
      });
    }
  }

  createPanResponder(props) {
    const {height} = props;
    const {pan} = this.state;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
          Animated.event([null, {dy: pan.y}], {
            useNativeDriver: false,
          })(e, gestureState);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        const gestureLimitArea = height / 3;
        const gestureDistance = gestureState.dy;
        if (gestureDistance > gestureLimitArea) {
          this.setModalVisible(false);
        } else {
          Animated.spring(pan, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
          }).start();
        }
      },
    });
  }

  show() {
    this.setModalVisible(true);
  }

  close() {
    this.setModalVisible(false);
  }

  render() {
    const {
      children,
      hasDraggableIcon,
      dragIconColor,
      dragIconStyle,
      draggable = true,
      radius,
      plus_height,
    } = this.props;
    const {animatedHeight, pan} = this.state;
    const panStyle = {
      // position: 'absolute',
      transform: pan.getTranslateTransform(),
    };
    console.log(plus_height)

    return (
      <Modal transparent={true}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}>
          <Animated.View
            {...(draggable && this.panResponder.panHandlers)}
            style={[
              panStyle,
              {flex: 1, justifyContent: 'flex-end', width: '100%',},
              {
                height: animatedHeight,
                borderTopRightRadius: radius,
                borderTopLeftRadius: radius,
                backgroundColor: '#0000',
              },
            ]}>
            {hasDraggableIcon && (
              <View
                style={[
                  styles.draggableContainer,
                  {
                    borderTopLeftRadius: radius,
                    borderTopRightRadius: radius,
                  },
                ]}>
                <View
                  style={[
                    styles.draggableIcon,
                    dragIconStyle,
                    {
                      backgroundColor: dragIconColor || '#ECEAEA',
                    },
                  ]}
                />
              </View>
            )}
            {children}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  draggableContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  draggableIcon: {
    width: 40,
    height: 6,
    borderRadius: 3,
    margin: 10,
    marginBottom: 0,
  },
});

export default BottomSheet;
