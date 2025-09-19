import { StyleSheet } from 'react-native';
import { Colors } from '../../../utils/color';
import { Fonts } from '../../../utils/fontSize';
import { Spacing } from '../../../utils/spacing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  header_top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  processLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.small,
  },
  line: {
    borderColor: Colors.Gray,
    borderWidth: 3,
    borderRadius: 100,
    marginBottom: Spacing.small,
    width: '33%',
  },
  body: {
    flex: 2,
    paddingTop: Spacing.large,
    paddingHorizontal: Spacing.medium,
    paddingBottom: Spacing.large,
  },
  body_item: {
    padding: Spacing.medium,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: Spacing.medium,
  },
  body_itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  body_itemButton: {
    marginTop: Spacing.medium,
    borderWidth: 0.5,
    paddingHorizontal: Spacing.medium,
    width: '48%',
    borderRadius: 20,
  },
  body_itemBody: {},
  button: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.small,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: '100%',
    borderRadius: 30,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    marginBottom: Spacing.medium,
    backgroundColor: Colors.white,
    borderColor: Colors.Gray,
    borderWidth: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.small,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingLeft: Spacing.medium,
    marginBottom: Spacing.medium,
  },
  descriptionInput: {
    height: 120, // Chiều cao lớn cho description
    textAlignVertical: 'top', // Đảm bảo text bắt đầu từ trên
  },
  scrollViewContainer: {
    maxHeight: 200, // Giới hạn chiều cao của ScrollView nếu cần
  },
  quantity: {
    marginHorizontal: Spacing.medium,
    fontSize: Fonts.large,
    color: Colors.black,
  },
  text: { color: Colors.black, fontSize: Fonts.normal },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 12,
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearImageIcon: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
    tintColor: Colors.white,
  },
});
export default styles;
