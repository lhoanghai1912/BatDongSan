import { logout } from '../store/reducers/userSlice';

export const MESSAGES = {
  loginSuccess: 'Login successful!',
  loginFailed: 'Login failed. Please try again.',
  networkError: 'Network error. Please check your internet connection.',
};

export const TITLES = {
  login: 'Đăng nhập',
  home: 'Home',
  profile: 'Profile',
  settings: 'Settings',
  accept: 'Xác nhận',
  cancel: 'Hủy bỏ',
  logout: 'Logout',
  menu: 'Menu',
  transaction: 'Transaction',
  report: 'Report',
  user: 'User',
};
export const ICONS = {
  search: require('../assets/icons/search.png'),
  search_focus: require('../assets/icons/search_focus.png'),
  heart: require('../assets/icons/heart.png'),
  heart_focus: require('../assets/icons/heart_focus.png'),
  user: require('../assets/icons/user.png'),
  user_focus: require('../assets/icons/user_focus.png'),
  show: require('../assets/icons/show_pass.png'),
  hide: require('../assets/icons/hide.png'),
  clear: require('../assets/icons/clear.png'),
  checked: require('../assets/icons/checked.png'),
  unchecked: require('../assets/icons/unchecked.png'),
};

export const IMAGES = {
  logo: require('../assets/images/company-logo.png'),
};
