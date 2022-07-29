import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

// suppress console spam from react
const originalWarn = console.warn.bind(console.warn);
const originalError = console.error.bind(console.error);
beforeAll(() => {
  console.warn = _msg => {};
  console.error = _msg => {};
});
afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
