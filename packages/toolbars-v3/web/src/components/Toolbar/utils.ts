export const handleCircularFocus = ({
  e,
  firstButtonDataHook,
  lastButtonDataHook,
  moreButtonWrapperRef,
  isMoreModalOpen,
  moreModalLastButtonDataHook,
}: {
  e: React.KeyboardEvent<HTMLDivElement>;
  firstButtonDataHook: string | null;
  lastButtonDataHook: string | null;
  moreButtonWrapperRef?: HTMLDivElement | null;
  isMoreModalOpen?: boolean;
  moreModalLastButtonDataHook?: string | null;
}) => {
  const firstButton = document.querySelector(
    `[data-hook=toolbar-v3] [data-hook=${firstButtonDataHook}]`
  ) as HTMLElement;

  const moreModalLastButton = document.querySelector(
    `[data-hook=toolbar-v3] [data-hook=${moreModalLastButtonDataHook}]`
  ) as HTMLElement;

  const moreButton = moreButtonWrapperRef?.children[0] as HTMLElement;

  const lastButton = isMoreModalOpen
    ? moreModalLastButton
    : moreButton ||
      (document.querySelector(
        `[data-hook=toolbar-v3] [data-hook=${lastButtonDataHook}]`
      ) as HTMLElement);

  if (e.shiftKey && e.keyCode === 9) {
    if (document.activeElement === firstButton) {
      lastButton?.focus();
      e.preventDefault();
    }
  } else if (e.keyCode === 9) {
    if (document.activeElement === lastButton) {
      firstButton?.focus();
      e.preventDefault();
    }
  }
  // else if (e.keyCode === KEYS_CHARCODE.ESCAPE) {
  //   const isClickFromModal = e.target.closest('[data-id=toolbar-modal-button]');
  //   !isClickFromModal && onEscape();
  //   e.stopPropagation();
  // }
};
