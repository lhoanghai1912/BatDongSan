import { StyleSheet } from 'react-native';
import { Colors } from '../../../utils/color';
import { Spacing } from '../../../utils/spacing';
import { Fonts } from '../../../utils/fontSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.medium,
    marginBottom: Spacing.medium,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Spacing.medium,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  searchIcon: {
    width: 40,
    height: 40,
    tintColor: '#000',
    marginHorizontal: Spacing.small,
    marginRight: 12,
  },
  searchLabel: {
    fontSize: Fonts.normal,
    fontWeight: 'bold',
    color: '#000',
  },
  searchPlaceholder: {
    fontSize: Fonts.normal,
    color: '#888',
  },
  itemCard: { borderBottomColor: Colors.Gray, borderBottomWidth: 2 },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterInput: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: Spacing.small,
    marginRight: Spacing.small,
    marginBottom: Spacing.small,
    maxWidth: 300,
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  underLine: {
    borderWidth: 1,
    borderColor: Colors.Gray,
    marginVertical: Spacing.medium,
    width: '100%',
  },
  // Add these to your styles object
  footerLoader: {
    paddingVertical: Spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: Spacing.small,
    fontSize: Fonts.small,
    color: Colors.darkGray,
  },

  noMorePostsContainer: {
    paddingVertical: Spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMorePostsText: {
    fontSize: Fonts.normal,
    color: Colors.darkGray,
    fontWeight: '500',
  },
});
export default styles;
