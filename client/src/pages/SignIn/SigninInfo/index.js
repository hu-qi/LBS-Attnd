import PropTypes from 'prop-types';
import { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { SigninerStatus } from '../../../utils/consts';
import './index.less';

const signinStatusConfig = {
  [SigninerStatus.ARRIVED]: {
    icon: 'check-circle',
    color: '#78a4fa',
    text: '已到'
  },
  [SigninerStatus.LATE]: {
    icon: 'clock',
    color: '#ffc82c',
    text: '迟到'
  },
  [SigninerStatus.OUT_OF_DIST]: {
    icon: 'map-pin',
    color: '#ff4949',
    text: '超距'
  }
}

export default class SigninInfo extends Component {

  static propTypes = {
    item: PropTypes.object
  }

  static defaultProps = {
    item: {}
  }

  componentDidMount() { }

  render() {
    const { name = '*', stuId = '', distance, signinerStatus } = this.props.item;
    const avatar = name[0] || '*';
    const status = signinStatusConfig[signinerStatus] || {};
    return (
      <View className="signin-info">
        <View className="signin-info__user">
          <Text className="signin-info__avatar">{avatar}</Text>
          <View className="signin-info__info">
            <Text className="signin-info__info--name">{`${name} ${stuId}`}</Text>
            <Text className="signin-info__info--desc">距离：{distance}m</Text>
          </View>
        </View>
        <View className="signin-info__status">
          <AtIcon value={status.icon} size={16} color={status.color}/>
          <Text className="signin-info__status--desc" style={{color: status.color}}>{status.text}</Text>
        </View>
      </View>
    )
  }
}
