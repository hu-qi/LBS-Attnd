import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtInput, AtButton } from 'taro-ui';
import AdToast from '../../components/AdToast';
import { getLocation } from '../../services/location';
import { createAttnd } from '../../services/attnd';
import * as adLog from '../../utils/adLog';
import './index.less';

export default class EditAttnd extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {
    attndName: '',
    isAttndNameErr: false,
    submiting: false
  }

  onInputChange = (value) => {
    this.setState({
      attndName: value,
      isAttndNameErr: false
    });
  }

  checkFormData = (attndName) => {
    if (!attndName.trim()) {
      Taro.adToast({ text: '名称不能为空' });
      this.setState({ isAttndNameErr: true });
      return false;
    }
    return true;
  }

  onSubmit = async () => {
    const { attndName, submiting } = this.state;
    if (!this.checkFormData(attndName)) {
      return;
    }
    if (submiting) return;
    this.setState({ submiting: true });

    try {
      // 获取地理位置
      const location = await getLocation();

      // 未授权获取位置
      if (!location) {
        Taro.navigateTo({ url: '../EditAuth/index' });
        this.setState({ submiting: false });
        return;
      }

      const res = await createAttnd({ attndName, location });

      // 未填写个人信息
      if (res.code === 3001) {
        Taro.adToast({ text: '请完善个人信息' });
        setTimeout(() => {
          Taro.navigateTo({ url: '../EditUserInfo/index' });
        }, 1500);
        this.setState({ submiting: false });
        return;
      }

      const passWd = res.data.passWd;
      Taro.adToast({ text: '发起成功', status: 'success'});
      setTimeout(() => {
        Taro.redirectTo({
          url: `../ShowPassWd/index?passWd=${passWd}`
        });
      }, 1500);
    } catch (e) {
      adLog.warn('EditAttnd-error', e);
      Taro.adToast({ text: '发起失败', status: 'error' });
    }
    this.setState({ submiting: false });
  }

  render () {
    const { attndName, isAttndNameErr, submiting } = this.state;
    return (
      <View className="edit-attnd">
        <View className="edit-attnd__title">发起考勤</View>
        <View className="edit-attnd__desc">*考勤范围是以你为中心的方圆 200 米</View>
        <View className="edit-attnd__input">
          <AtInput
            type='text'
            placeholder='输入考勤名称'
            placeholderStyle="color: #cccccc"
            error={isAttndNameErr}
            maxLength={150}
            value={attndName}
            onChange={this.onInputChange}
          />
        </View>
        <View className="edit-attnd__btn">
          <AtButton
            type="primary"
            loading={submiting}
            onClick={this.onSubmit}
          >立即发起
          </AtButton>
        </View>
        <AdToast />
      </View>
    )
  }
}
