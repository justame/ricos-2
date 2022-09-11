/* eslint-disable react/self-closing-comp */
import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line wix-style-react/no-full-wsr-lib
import { Layout, Palette, ToggleSwitch } from 'wix-style-react';
import { Page, Section, ContentState } from '../Components/StoryParts';
import exampleState from '../../../../e2e/tests/fixtures/storybook-example-app-doc-style.json';
import { wixPalettes, ricosPalettes } from '../../src/shared/resources/palettesExample';
import { FONTS } from '../../src/shared/resources/fontsExample';
import ExampleApplication from '../Components/ExampleApplication';
import { SelectorCell } from './SelectorCell';
import type { RicosTheme } from 'ricos-common';
import { withWixStyle } from './wixStyle';
import { withOneAppStyle } from './oneAppStyle';
import { ToggleTiptapButton } from '../Components/ToggleTiptapButton';

const palettes = Object.keys(wixPalettes);

const ThemeSelector = () => {
  const [palettePage, setPalettePage] = useState(0);
  const [fontPage, setFontPage] = useState(0);
  const [isFallback, setFallback] = useState(false);
  const [isFloatingBM, setFloatingBM] = useState(false);
  const [isOneApp, setOneApp] = useState(false);
  const [isTiptap, setIsTiptap] = useState(false);
  const [useExternalModalsContainer, setUseExternalModalsContainer] = useState(false);
  const modalsContainerRef = useRef<HTMLDivElement>(null);
  const fallbackColor = isFallback ? '#FF0000' : undefined;
  const palette = ricosPalettes[palettePage];
  const values = Object.values(palette);
  const createTheme = (theme: RicosTheme) => {
    let currentTheme = theme;
    if (isOneApp) {
      currentTheme = withOneAppStyle(currentTheme);
    }
    if (isFloatingBM) {
      currentTheme = withWixStyle(currentTheme);
    }
    return currentTheme;
  };

  useEffect(() => {
    document.onkeyup = event => {
      if (event.shiftKey) {
        if (event.key === 'ArrowLeft') {
          fontPage > 0 && setFontPage(fontPage - 1);
        } else if (event.key === 'ArrowRight') {
          fontPage < FONTS.length - 1 && setFontPage(fontPage + 1);
        }
      } else if (event.key === 'ArrowLeft') {
        palettePage > 0 && setPalettePage(palettePage - 1);
      } else if (event.key === 'ArrowRight') {
        palettePage < palettes.length - 1 && setPalettePage(palettePage + 1);
      }
    };
  }, [fontPage, palettePage]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: https://github.com/wix-private/wix-design-systems/pull/7554
  const PaletteElement = () => <Palette fill={values} />;

  return (
    <>
      <div id="modalsExternalContainer" ref={modalsContainerRef}></div>

      <Layout cols={12} justifyItems={'center'}>
        <SelectorCell
          type={'a Palette'}
          index={palettePage}
          setIndex={setPalettePage}
          length={palettes.length}
        >
          <PaletteElement />
        </SelectorCell>

        <SelectorCell
          type={'Fonts'}
          index={fontPage}
          setIndex={newFontPage => setFontPage(newFontPage)}
          length={FONTS.length}
        >
          <div>
            <div>H2: {FONTS[fontPage].h2.fontFamily}</div>
            <div>P: {FONTS[fontPage].p.fontFamily}</div>
          </div>
        </SelectorCell>
      </Layout>

      <div>
        <ToggleSwitch checked={isFallback} onChange={({ target }) => setFallback(target.checked)} />
        <span> Use RED fallback color</span>
      </div>
      <div>
        <ToggleSwitch
          checked={isFloatingBM}
          onChange={({ target }) => setFloatingBM(target.checked)}
        />
        <span> Use BM Blue floating action color</span>
      </div>
      <div>
        <ToggleSwitch checked={isOneApp} onChange={({ target }) => setOneApp(target.checked)} />
        <span> Use OneApp styles</span>
      </div>
      <div>
        <ToggleSwitch
          checked={useExternalModalsContainer}
          onChange={({ target }) => setUseExternalModalsContainer(target.checked)}
        />
        <span> Use External Modals Container</span>
      </div>
      <ToggleTiptapButton isTiptap={isTiptap} setIsTiptap={setIsTiptap} />
      <div style={{ backgroundColor: palette.bgColor, padding: 4 }}>
        <ExampleApplication
          key={palettePage}
          initialState={exampleState}
          theme={createTheme({
            palette: { ...palette, fallbackColor },
            customStyles: FONTS[fontPage],
          })}
          rceNext={isTiptap}
          modalSettings={
            useExternalModalsContainer
              ? {
                  container: modalsContainerRef.current,
                }
              : undefined
          }
        />
      </div>
    </>
  );
};

export default () => {
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Yellowtail&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://static.parastorage.com/unpkg/@wix/wix-fonts@1.11.0/madefor.css"
      />

      <Page title="Ricos Theme">
        See Usage{' '}
        <a target="_blank" rel="noreferrer" href="https://wix.github.io/ricos/docs/ricos/theming">
          here
        </a>
        <ThemeSelector />
        <Section title="Content State">
          <ContentState json={exampleState} />
        </Section>
      </Page>
    </>
  );
};
