import type { CustomTextualStyle, RicosCustomStyles } from 'wix-rich-content-common';

const mockTextualStyles: CustomTextualStyle = {
  fontFamily: 'Times',
  fontSize: '40px',
  color: 'orange',
  fontStyle: 'italic',
  textDecoration: 'underline',
  fontWeight: 'bold',
  lineHeight: '40px',
  minHeight: '40px',
};
export const customStylesMock: RicosCustomStyles = {
  h1: mockTextualStyles,
  h2: mockTextualStyles,
  h3: mockTextualStyles,
  h4: mockTextualStyles,
  h5: mockTextualStyles,
  h6: mockTextualStyles,
  p: mockTextualStyles,
  link: mockTextualStyles,
  hashtag: mockTextualStyles,
  footerToolbar: { marginTop: '120px' },
  button: { color: 'purple' },
  mention: {
    backgroundColor: 'lightcyan',
    color: 'lightsalmon',
  },
  codeBlock: {
    fontSize: '35px',
    lineHeight: '35px',
    margin: '30px',
    padding: '30px',
  },
  quote: {
    ...mockTextualStyles,
    borderColor: 'olive',
    borderWidth: '6px',
    paddingTop: '20px',
    paddingBottom: '20px',
    paddingInlineStart: '20px',
  },
};
