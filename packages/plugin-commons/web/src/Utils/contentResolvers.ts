export const selectedNodeResolver = {
  id: 'selectedNode',
  resolve: (_, __, editor) => {
    const node = editor?.state?.selection?.node;
    if (node) {
      return node;
    } else {
      return undefined;
    }
  },
};

export const getVisibleOnlyOnDesktopResolver = isMobile => ({
  id: 'VISIBLE_ONLY_ON_DESKTOP',
  resolve: () => !isMobile,
});
