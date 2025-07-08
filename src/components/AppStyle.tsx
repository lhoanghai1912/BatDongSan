import { StyleSheet } from 'react-native';
import { Fonts } from '../utils/fontSize';
import { Colors } from '../utils/color';
import { Spacing } from '../utils/spacing';

const AppStyles = StyleSheet.create({
  header: { flex: 0.7, marginTop: Spacing.xxxlarge },
  body: { flex: 3 },
  footer: { flex: 0.3 },

  title: {
    fontSize: Fonts.xlarge,
    color: Colors.black,
    textAlign: 'center',
    fontWeight: 500,
    marginBottom: Spacing.medium,
  },
  label: {
    fontSize: Fonts.large,
    marginBottom: Spacing.small,
    color: '#333',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: Spacing.medium,
    verticalAlign: 'middle',
    fontSize: Fonts.normal,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: Spacing.medium,
  },
  disable: {
    opacity: 0.5,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: Spacing.medium,
    verticalAlign: 'middle',
    fontSize: Fonts.normal,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: Spacing.medium,
  },
  avartar: {
    width: 100,
    height: 100,
    borderRadius: 500,
  },
  text: {
    fontSize: Fonts.normal,
  },
  whitetext: {
    fontSize: Fonts.normal,
    color: Colors.white,
  },

  icon: { width: 30, height: 30 },

  iconSingle: {
    width: 30,
    flexDirection: 'row',
    position: 'absolute',
    resizeMode: 'contain',
    right: Spacing.small,
    top: '20%',
    justifyContent: 'space-between',
  },

  iconGroup: {
    width: 60,
    flexDirection: 'row',
    position: 'absolute',
    resizeMode: 'contain',
    top: '20%',
    justifyContent: 'space-between',
    right: Spacing.small,
  },

  buttonGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.medium,
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.medium,
  },
  scrollContent: {
    paddingBottom: Spacing.large, // Đảm bảo có đủ không gian khi cuộn
  },
  dropdownWrapper: {
    position: 'relative', // Quan trọng để định vị dropdown tuyệt đối bên trong
  },
  dropdown: {
    position: 'absolute',
    top: 90, // Tùy chỉnh tùy theo chiều cao input
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    zIndex: 100,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  linkText: {
    color: Colors.primary,
    textAlign: 'center',
    fontSize: Fonts.normal,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.blue,
  },
});

export default AppStyles;
