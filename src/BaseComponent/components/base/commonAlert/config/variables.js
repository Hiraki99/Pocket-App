import {scale} from '../helpers/scalling';
import {width} from '../helpers/dimensions';
import {colors} from '~/themes';

export default {
  scale: size => {
    return scale(size);
  },

  /**
   * Font size
   */
  get baseFontSize() {
    return 14;
  },

  get smallFontSize() {
    return 12;
  },

  get mediumFontSize() {
    return 17;
  },

  get largeFontSize() {
    return 24;
  },

  /**
   * Colors
   */
  get baseBackgroundColor() {
    return '#FFFFFF';
  },

  get textColor() {
    return colors.helpText;
  },

  get subtitleColor() {
    return colors.helpText;
  },

  get white() {
    return '#FFFFFF';
  },

  get black() {
    return '#333333';
  },

  get default() {
    return '#e0e0e0';
  },

  get inverse() {
    return '#343a40';
  },

  get success() {
    return '#28a745';
  },

  get info() {
    return '#007bff';
  },

  get danger() {
    return '#dc3545';
  },

  get warning() {
    return '#ffc107';
  },

  /**
   * Themes backgrounds
   */
  get defaultBackground() {
    return this.default;
  },

  get inverseBackground() {
    return this.inverse;
  },

  get successBackground() {
    return this.success;
  },

  get infoBackground() {
    return this.info;
  },

  get dangerBackground() {
    return this.danger;
  },

  get warningBackground() {
    return this.warning;
  },

  /**
   * Themes colors
   */
  get defaultColor() {
    return this.black;
  },

  get inverseColor() {
    return this.white;
  },

  get successColor() {
    return this.white;
  },

  get infoColor() {
    return this.white;
  },

  get dangerColor() {
    return this.white;
  },

  get warningColor() {
    return this.black;
  },

  get overlayBackgroundColor() {
    return 'rgba(0, 0, 0, 0.4)';
  },

  get gutter() {
    return this.scale(24);
  },

  /**
   * Borders
   */
  get baseBorderRadius() {
    return 15;
  },

  // Content
  get contentWidth() {
    return width * 0.8;
  },

  // Header circle
  get headerCircleSize() {
    return this.scale(80);
  },
};
