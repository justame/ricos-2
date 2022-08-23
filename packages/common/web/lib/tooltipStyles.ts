const commonStyles = (followMouse, place, tooltipOffset) => ({
  style: {
    position: followMouse ? 'relative' : 'absolute',
    fontSize: '14px',
    marginTop: place === 'top' && tooltipOffset ? Math.abs(tooltipOffset.y) : tooltipOffset?.y,
    pointerEvents: 'none',
    transition: 'none',
    fontWeight: '300',
    zIndex: 1000000,
  },
  arrowStyle: {
    pointerEvents: 'none',
    transition: 'none',
  },
});

export const getTooltipStyles = (
  isError?: boolean,
  followMouse?: boolean,
  tooltipOffset?: { x: number; y: number },
  place?: 'top' | 'bottom' | 'left' | 'right',
  brightMode?: boolean
) => {
  const getFontFamily = () => {
    let fontFamily = 'HelveticaNeue';
    if (typeof window !== 'undefined') {
      const stylesContainer = document.querySelector(`[data-hook=root-editor]`) || document.body;
      const styles = window.getComputedStyle(stylesContainer);
      fontFamily = styles.getPropertyValue('--ricos-settings-text-font-family') || 'HelveticaNeue';
    }
    return fontFamily;
  };

  return brightMode
    ? {
        style: {
          ...commonStyles(followMouse, tooltipOffset, place).style,
          background: isError ? '#F64D43' : 'rgb(255,255,255)',
          color: '#000',
          fontFamily: 'var(--ricos-font-family, HelveticaNeue)',
          fontSize: '16px',
          padding: '20px',
          borderColor: '#000',
          boxShadow: '0 0 1px',
          maxWidth: '450px',
          textAlign: 'center',
          width: '100%',
        },
        arrowStyle: {
          color: isError ? '#F64D43' : 'rgb(255,255,255)',
          borderColor: 'rgb(0,0,0,.1)',
          ...commonStyles(followMouse, tooltipOffset, place).arrowStyle,
        },
      }
    : {
        style: {
          ...commonStyles(followMouse, tooltipOffset, place).style,
          background: isError ? '#F64D43' : 'rgb(0,0,0)',
          color: 'white',
          padding: '8px 12px',
          fontFamily: getFontFamily(),
          border: 'solid 1px rgba(255,255,255,0.38)',
          maxWidth: '180px',
        },
        arrowStyle: {
          color: isError ? '#F64D43' : 'rgb(0,0,0)',
          borderColor: 'rgba(255,255,255,0.38)',
          ...commonStyles(followMouse, tooltipOffset, place).arrowStyle,
        },
      };
};
