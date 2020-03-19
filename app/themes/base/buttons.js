export default ({ colors, borders, radii }) => ({
  primary: {
    backgroundColor: colors.purpleMedium,
    border: borders.input,
    borderColor: colors.purpleMedium,
    color: colors.white,
    borderRadius: radii.default,
    '&:hover,&:active': {
      backgroundColor: colors.text.primary,
      borderColor: colors.text.primary,
    },
    '&:disabled': {
      backgroundColor: colors.lightestGrey,
      borderColor: colors.lightestGrey,
      color: colors.text.primaryDisabled,
    },
  },
  secondary: {
    backgroundColor: colors.white,
    color: colors.text.primary,
    border: borders.input,
    borderRadius: radii.default,
    '&:hover,&:active': {
      color: colors.white,
      backgroundColor: colors.text.primary,
      borderColor: colors.text.primary,
    },
    '&:disabled': {
      backgroundColor: colors.lightestGrey,
      borderColor: colors.lightestGrey,
      color: colors.text.primaryDisabled,
    },
  },
});
