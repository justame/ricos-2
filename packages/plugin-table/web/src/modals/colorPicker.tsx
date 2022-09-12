import React from 'react';

export const colorPicker = ({ isMobile, header }) => {
  return ({
    renderPalette,
    renderUserColors,
    renderAddColorButton,
    renderResetColorButton,
    mergedStyles,
  }) => (
    <>
      {isMobile && (
        <>
          <div className={mergedStyles.colorPicker_header}>{header}</div>
          <div className={mergedStyles.colorPicker_separator} />
        </>
      )}
      <div className={mergedStyles.colorPicker_palette}>
        <div className={mergedStyles.colorPicker_buttons_container}>
          {renderPalette()}
          {renderUserColors()}
          {isMobile && renderAddColorButton()}
        </div>
        {!isMobile && (
          <>
            <hr className={mergedStyles.colorPicker_separator} />
            <div className={mergedStyles.colorPicker_bottom_container}>
              {renderResetColorButton()}
              {renderAddColorButton()}
            </div>
          </>
        )}
      </div>
    </>
  );
};
